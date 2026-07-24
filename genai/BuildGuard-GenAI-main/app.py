"""
BuildGuard-AI — Site Blueprint & Safety Compliance Engine
FastAPI application entrypoint.

Run locally:
    uvicorn app:app --reload --port 8000

This file only wires things together — routers, logging, CORS.
Business logic always lives in services/, never here.
"""

import sys
from loguru import logger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.config import settings
from api import health
from api.analyze import router as analyze_router
from api.warning import router as warning_router
from api.status import router as status_router   # NEW

# -------------------------------------------------------
# Logging Setup
# -------------------------------------------------------

logger.remove()
logger.add(
    sys.stdout,
    level=settings.log_level,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {module}:{function}:{line} | {message}",
)

# -------------------------------------------------------
# FastAPI Application
# -------------------------------------------------------

app = FastAPI(
    title=settings.app_name,
    description=(
        "Detects construction site safety violations from inspection "
        "reports against blueprint safety rules using a RAG pipeline."
    ),
    version="0.1.0",
)

# -------------------------------------------------------
# CORS Configuration
# -------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env == "local" else [],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# -------------------------------------------------------
# Register API Routers
# -------------------------------------------------------

app.include_router(health.router)
app.include_router(analyze_router)
app.include_router(warning_router)
app.include_router(status_router)   # NEW

# -------------------------------------------------------
# Startup Log
# -------------------------------------------------------

logger.info(f"{settings.app_name} starting in '{settings.app_env}' mode")