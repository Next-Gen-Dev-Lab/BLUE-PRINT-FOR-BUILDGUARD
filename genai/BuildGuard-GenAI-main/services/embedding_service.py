from sentence_transformers import SentenceTransformer
from config.config import settings


class EmbeddingService:
    def __init__(self):
        """
        Load the embedding model.
        """
        self.model = SentenceTransformer(
            settings.embedding_model_name
        )

    def generate_embeddings(self, texts):
        """
        Generate embeddings for text chunks.
        """
        return self.model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=False
        )