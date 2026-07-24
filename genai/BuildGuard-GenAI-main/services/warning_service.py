from datetime import datetime


class WarningService:
    """
    Formats the LLM analysis into a structured response.
    """

    def generate_warning_report(self, analysis: str) -> dict:
        """
        Generate a standardized warning report.
        """

        return {
            "status": "success",
            "message": "Construction safety analysis completed successfully.",
            "timestamp": datetime.utcnow().isoformat(),
            "analysis": analysis
        }


# Singleton instance
warning_service = WarningService()