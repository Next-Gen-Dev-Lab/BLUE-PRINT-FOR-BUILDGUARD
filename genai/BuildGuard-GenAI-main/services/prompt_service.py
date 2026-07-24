class PromptService:
    """
    Builds prompts for the LLM using
    safety documents and inspection reports.
    """

    def build_prompt(
        self,
        inspection_report: str,
        retrieved_context: list[str]
    ) -> str:

        context = "\n\n".join(retrieved_context) if retrieved_context else "No safety documents available."

        return f"""
You are an expert Construction Safety AI assistant.

Use ONLY the provided Safety Documents to analyze the Inspection Report.
If the documents do not contain enough information, state that clearly instead of guessing.
Do not make assumptions or invent information.

=========================
Safety Documents
=========================
{context}

=========================
Inspection Report
=========================
{inspection_report}

=========================
Tasks
=========================

Analyze the inspection report and provide:

1. Safety Violations
2. Potential Hazards
3. Risk Level (Low / Medium / High)
4. Recommended Corrective Actions
5. Required PPE
6. OSHA Compliance Issues (if any)

Return ONLY valid JSON.

{{
    "risk_level": "",
    "violations": [],
    "hazards": [],
    "corrective_actions": [],
    "ppe": [],
    "osha_compliance": []
}}
"""


prompt_service = PromptService()