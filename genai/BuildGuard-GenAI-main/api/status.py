from datetime import datetime
from fastapi import APIRouter

router = APIRouter(
    prefix="/status",
    tags=["Status"]
)

@router.get("")
async def get_status():
    return {
        "serviceStatus": "UP",
        "databaseStatus": "UP",
        "s3Status": "UP",
        "llmStatus": "UP",
        "vectorDbStatus": "UP",
        "timestamp": datetime.utcnow().isoformat()
    }