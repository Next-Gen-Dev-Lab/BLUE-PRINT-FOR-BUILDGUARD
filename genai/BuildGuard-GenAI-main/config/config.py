"""
Centralized application configuration.

All services import `settings` from here instead of reading os.environ
directly. This keeps configuration in one auditable place and gives us
type validation (via pydantic) for free — a malformed .env fails fast
at startup instead of causing a confusing error three services deep.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- App ---
    app_name: str = "BuildGuard-AI"
    app_env: str = "local"
    app_port: int = 8000
    log_level: str = "INFO"

    # --- AWS S3 ---
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "ap-south-1"
    s3_bucket_name: str = "buildguard-blueprints"
    s3_blueprint_prefix: str = "blueprints/"
    s3_safety_manual_prefix: str = "safety-manuals/"

    # --- Amazon RDS ---
    rds_host: str = ""
    rds_port: int = 3306
    rds_db_name: str = "buildguard"
    rds_user: str = ""
    rds_password: str = ""
    rds_pool_size: int = 5
    rds_max_overflow: int = 10

    # --- FAISS / embeddings ---
    faiss_index_path: str = "./vector_db/faiss_index"
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    chunk_size: int = 1000
    chunk_overlap: int = 150

    # --- Nous Hermes ---
    nous_hermes_base_url: str = "http://localhost:8080/v1"
    nous_hermes_api_key: str = "local-key"
    nous_hermes_model_name: str = "NousResearch/Hermes-2-Pro-Llama-3-8B"
    nous_hermes_temperature: float = 0.1
    nous_hermes_max_tokens: int = 1500

    # --- OpenClaw ---
    openclaw_base_url: str = "http://localhost:8081/v1"
    openclaw_api_key: str = "local-key"
    openclaw_model_name: str = "openclaw-warning-gen"

    # --- Security ---
    api_key_header_name: str = "X-API-KEY"
    api_key_secret: str = "change-me-in-production"

    @property
    def rds_connection_string(self) -> str:
        return (
            f"mysql+pymysql://{self.rds_user}:{self.rds_password}"
            f"@{self.rds_host}:{self.rds_port}/{self.rds_db_name}"
        )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings accessor. lru_cache means the .env file is parsed
    once per process, not on every import — matters once rds_service,
    s3_service, llm_service etc. all import this at module load time.
    """
    return Settings()


settings = get_settings()
