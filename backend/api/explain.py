from fastapi import APIRouter
from pydantic import BaseModel
from backend.matching import ResumeMatcher

router = APIRouter()
matcher = ResumeMatcher()

class ExplainRequest(BaseModel):
    job_description: str
    resume_chunks: list

@router.post("/explain-match")
def explain_match(req: ExplainRequest):
    explanation = matcher.explain_match(
        req.job_description,
        req.resume_chunks
    )

    return {
        "explanation": explanation
    }
