class LLMService:
    """
    Temporary LLM Service.

    This class returns a mock response until the
    actual Nous Hermes/OpenClaw model is integrated.
    """

    def __init__(self):
        self.model_name = "Mock LLM"

    def analyze(self, prompt: str) -> str:
        """
        Analyze the prompt using the LLM.
        Currently returns a mock response.
        """

        # TODO:
        # Replace this with Nous Hermes/OpenClaw inference.

        return """
{
    "risk_level": "High",
    "violations": [
        "Workers are not wearing helmets.",
        "Workers are not using safety harnesses."
    ],
    "hazards": [
        "Fall hazard from scaffolding.",
        "Head injury risk."
    ],
    "corrective_actions": [
        "Ensure all workers wear helmets.",
        "Use full-body safety harnesses.",
        "Install guard rails around scaffolding.",
        "Conduct daily safety inspections."
    ],
    "ppe": [
        "Safety Helmet",
        "Safety Harness",
        "Safety Shoes",
        "Reflective Vest"
    ],
    "osha_compliance": [
        "PPE requirements are not being followed."
    ]
}
"""


# Singleton instance
llm_service = LLMService()