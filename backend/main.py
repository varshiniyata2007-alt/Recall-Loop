import logging
from typing import Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import settings
from backend.hindsight_service import hindsight_service
from backend.complaint_service import complaint_service
from backend.llm_service import llm_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("recallloop")

from backend.hindsight_service import hindsight_service, HindsightConfigurationError
from fastapi.responses import JSONResponse

app = FastAPI(
    title="RecallLoop API",
    description="AI Product Memory Agent backend powered by Hindsight and Groq",
    version="1.0.0"
)

@app.exception_handler(HindsightConfigurationError)
async def hindsight_config_exception_handler(request, exc: HindsightConfigurationError):
    return JSONResponse(
        status_code=503,
        content={
            "error": "HindsightConfigurationError",
            "detail": str(exc),
            "hindsight_status": hindsight_service.get_status()
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Request / Response Schemas
# ------------------------------------------------------------------------------
class ComplaintRequest(BaseModel):
    complaint: str

class RetainRequest(BaseModel):
    problem: str
    action: str
    result: str

class ConfigUpdateRequest(BaseModel):
    hindsight_api_key: Optional[str] = None
    hindsight_api_url: Optional[str] = None
    hindsight_bank_id: Optional[str] = None
    groq_api_key: Optional[str] = None

# ------------------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------------------
@app.get("/api/status")
def get_system_status():
    """Returns real Hindsight connection status and Groq LLM status."""
    h_status = hindsight_service.get_status()
    g_status = llm_service.get_status()
    return {
        "app_name": "RecallLoop",
        "subtitle": "AI Product Memory Agent",
        "hindsight": h_status,
        "groq": g_status,
        "environment": {
            "hindsight_bank_id": settings.HINDSIGHT_BANK_ID,
            "hindsight_api_url": settings.HINDSIGHT_API_URL,
            "has_hindsight_key": bool(settings.HINDSIGHT_API_KEY),
            "has_groq_key": bool(settings.GROQ_API_KEY),
        }
    }

@app.post("/api/config/update")
def update_configuration(req: ConfigUpdateRequest):
    """Dynamically updates API keys / URLs and reinitializes services."""
    if req.hindsight_api_key is not None:
        settings.HINDSIGHT_API_KEY = req.hindsight_api_key.strip()
    if req.hindsight_api_url is not None:
        settings.HINDSIGHT_API_URL = req.hindsight_api_url.strip()
    if req.hindsight_bank_id is not None:
        settings.HINDSIGHT_BANK_ID = req.hindsight_bank_id.strip()
    if req.groq_api_key is not None:
        settings.GROQ_API_KEY = req.groq_api_key.strip()

    # Reinitialize services
    hindsight_service._init_client()
    llm_service._init_client()

    return {
        "success": True,
        "message": "Configuration updated successfully",
        "hindsight_status": hindsight_service.get_status(),
        "groq_status": llm_service.get_status()
    }

@app.get("/api/dashboard/overview")
def get_dashboard_overview():
    """Screen 1: Overview Dashboard metrics and problem list."""
    return complaint_service.get_overview_metrics()

@app.post("/api/complaints/analyze")
def analyze_complaint(req: ComplaintRequest):
    """
    Screen 2 & 3: Complaint Analysis + Hindsight Memory Recall.
    1. Matches complaint to underlying product problem.
    2. Recalls experience from Hindsight.
    3. Synthesizes FACT vs AI INSIGHT.
    """
    complaint_text = req.complaint.strip()
    if not complaint_text:
        raise HTTPException(status_code=400, detail="Complaint text cannot be empty.")

    # 1. Match complaint to problem
    classification = complaint_service.register_complaint(complaint_text)
    problem_name = classification["detected_problem"]

    # 2. Recall memory from Hindsight
    hindsight_result = hindsight_service.recall_experience(problem_name)

    # 3. Generate Fact vs Insight
    insight_synthesis = llm_service.generate_agent_insight(
        problem=problem_name,
        current_complaint=complaint_text,
        hindsight_result=hindsight_result
    )

    return {
        "complaint": complaint_text,
        "classification": classification,
        "hindsight_recall": hindsight_result,
        "insight_synthesis": insight_synthesis
    }

@app.post("/api/memory/retain")
def retain_experience(req: RetainRequest):
    """
    Screen 4 & 5: Product Team Action & Outcome Recording.
    Saves Problem -> Action -> Result into Hindsight.
    """
    if not req.problem or not req.action or not req.result:
        raise HTTPException(status_code=400, detail="Problem, Action, and Result are all required.")

    result = hindsight_service.retain_experience(
        problem=req.problem.strip(),
        action=req.action.strip(),
        result=req.result.strip()
    )
    return result

@app.get("/api/memory/history")
def get_memory_history():
    """
    Screen 6: Memory / Experience History timeline proving the learning loop:
    Problem -> Action -> Result -> Problem Returned -> New Action -> New Result
    """
    history = hindsight_service.get_all_history()
    return {
        "history": history,
        "count": len(history),
        "hindsight_bank": settings.HINDSIGHT_BANK_ID
    }

@app.post("/api/memory/reset")
def reset_memory_bank():
    """Resets memory state for clean demonstration."""
    res = hindsight_service.clear_bank()
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
