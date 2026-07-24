"""
Health and status endpoints.

Kept separate from analyze.py/warning.py because these are hit by
load balancers and uptime checks at high frequency — they must never
depend on FAISS, RDS, or the LLM being reachable. A health check that
can fail because the vector index is being rebuilt is a bad health check.
"""

from fastapi import APIRouter
from datetime import datetime, timezone

from config.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health():
    """Liveness probe. Always returns 200 if the process is up."""
    return {"status": "ok", "service": settings.app_name}


@router.get("/status")
def status():
    """
    Readiness-style probe with a bit more detail. Deliberately does not
    ping S3/RDS/FAISS here — that belongs in a separate deep-health
    check if the ops team wants one, so this stays fast and reliable.
    """
    return {
        "service": settings.app_name,
        "environment": settings.app_env,
        "time_utc": datetime.now(timezone.utc).isoformat(),
        "version": "0.1.0",
    }
