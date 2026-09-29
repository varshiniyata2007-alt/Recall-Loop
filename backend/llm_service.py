import os
import json
import logging
from typing import Dict, Any, List, Optional
from backend.config import settings

logger = logging.getLogger("llm_service")

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    logger.warning("groq library not available.")

class LLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self._init_client()

    def _init_client(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        if GROQ_AVAILABLE and self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to instantiate Groq client: {e}")
                self.client = None
        else:
            self.client = None

    def get_status(self) -> Dict[str, Any]:
        has_key = bool(self.api_key and len(self.api_key) > 5)
        return {
            "groq_installed": GROQ_AVAILABLE,
            "has_key": has_key,
            "model": self.model,
            "active": bool(self.client and has_key)
        }

    def generate_agent_insight(
        self,
        problem: str,
        current_complaint: str,
        hindsight_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Synthesizes Hindsight Memory + Complaint into clear FACT vs AI INSIGHT.
        Strictly follows:
        - NEVER invent previous fixes or results.
        - If no memory: "No relevant previous experience found."
        - Clearly distinguish FACT from AI INSIGHT.
        - Does NOT make business decisions or modify product.
        """
        has_experience = hindsight_result.get("has_relevant_experience", False)
        memories = hindsight_result.get("memories", [])
        prev_action = hindsight_result.get("previous_action")
        prev_result = hindsight_result.get("previous_result")
        source = hindsight_result.get("source", "NONE")

        # CASE 1: No previous experience exists
        if not has_experience or not memories:
            fact_data = {
                "has_memory": False,
                "problem": problem,
                "previous_action": None,
                "previous_result": None,
                "what_happened_next": None,
                "statement": "No relevant previous experience found in Hindsight.",
                "hindsight_source": source
            }
            insight_data = {
                "headline": "First Recorded Incident",
                "recurrence_alert": "New Problem Encountered",
                "summary": (
                    f"This is the first time an occurrence of '{problem}' has been analyzed with no prior product history "
                    "in persistent Hindsight memory. Any action and outcome recorded by the product team today will become "
                    "reusable memory for future incidents."
                ),
                "suggested_focus": "Investigate root cause, determine appropriate mitigation, and record the action.",
                "notice": "The product team must decide what action to take. RecallLoop does not modify products autonomously."
            }
            return {
                "fact": fact_data,
                "agent_insight": insight_data,
                "engine_used": "deterministic_fact_engine"
            }

        # CASE 2: Previous experience exists in Hindsight
        # Try calling Groq if configured
        if self.client:
            try:
                system_prompt = (
                    "You are RecallLoop, an AI Product Memory Agent. "
                    "You assist product teams by recalling previous experiences stored in Hindsight semantic memory. "
                    "CRITICAL RULES:\n"
                    "1. NEVER invent or hallucinate previous actions, fixes, or results. Use ONLY the provided Hindsight context.\n"
                    "2. Do NOT make the final business decision or claim to auto-fix code.\n"
                    "3. Clearly distinguish FACT (what is recorded in Hindsight) from AI INSIGHT (your synthesis for the product team).\n"
                    "4. Output MUST be valid JSON with keys: 'fact', 'agent_insight'."
                )
                
                user_prompt = f"""
Current Customer Complaint: "{current_complaint}"
Identified Product Problem: "{problem}"

RECALLED HINDSIGHT MEMORY CONTEXT:
{hindsight_result.get('raw_context', '')}
Previous Action: {prev_action}
Previous Result: {prev_result}

Generate JSON response with this exact structure:
{{
  "fact": {{
    "has_memory": true,
    "problem": "{problem}",
    "previous_action": "{prev_action}",
    "previous_result": "{prev_result}",
    "what_happened_next": "Problem has returned in incoming complaints.",
    "statement": "{problem} is recurring. A previous fix reduced complaints temporarily, but the problem returned.",
    "hindsight_source": "{source}"
  }},
  "agent_insight": {{
    "headline": "RECURRING PROBLEM DETECTED",
    "recurrence_alert": "{problem} is recurring. A previous fix reduced complaints temporarily, but the problem returned.",
    "summary": "Concise 2-sentence breakdown of why this previous action did not permanently eliminate the issue.",
    "suggested_focus": "Recommended investigation area for the product team to evaluate.",
    "notice": "The product team decides the action. RecallLoop does not autonomously modify the product."
  }}
}}
"""
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2,
                    response_format={"type": "json_object"}
                )
                content = response.choices[0].message.content
                parsed = json.loads(content)
                parsed["engine_used"] = f"groq ({self.model})"
                return parsed

            except Exception as e:
                logger.error(f"Groq API call failed or timed out: {e}")

        # Deterministic factual synthesis fallback
        action_text = prev_action or "Previous action recorded in Hindsight"
        result_text = prev_result or "Previous outcome recorded in Hindsight"

        fact_data = {
            "has_memory": True,
            "problem": problem,
            "previous_action": action_text,
            "previous_result": result_text,
            "what_happened_next": "The issue has re-emerged in current customer complaints.",
            "statement": f"{problem} is recurring. A previous fix reduced complaints temporarily, but the problem returned.",
            "hindsight_source": source
        }

        insight_data = {
            "headline": "RECURRING PROBLEM DETECTED",
            "recurrence_alert": f"{problem} is recurring. A previous fix reduced complaints temporarily, but the problem returned.",
            "summary": (
                f"Hindsight retrieved that '{action_text}' was previously executed, which resulted in '{result_text}'. "
                "Because the problem has reoccurred in customer complaints, the prior mitigation was likely temporary or incomplete."
            ),
            "suggested_focus": (
                "Evaluate whether a deeper architectural update (such as gateway retry logic, fallback routing, or webhook reliability) "
                "is needed rather than repeating the same interim measure."
            ),
            "notice": "The product team decides the action. RecallLoop does not autonomously modify the product."
        }

        return {
            "fact": fact_data,
            "agent_insight": insight_data,
            "engine_used": "deterministic_fact_engine"
        }

llm_service = LLMService()
