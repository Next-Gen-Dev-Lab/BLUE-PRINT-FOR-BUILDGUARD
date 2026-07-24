from fastapi import APIRouter

router = APIRouter()


@router.post("/warning")
def generate_warning(data: dict):
    """
    Generate a warning report.
    """

    return {
        "status": "success",
        "message": "Warning endpoint is working.",
        "data": data
    }