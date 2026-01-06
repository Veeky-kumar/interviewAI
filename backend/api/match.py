from fastapi import APIRouter
from pydantic import BaseModel
from backend.matching import ResumeMatcher

router = APIRouter()
matcher = ResumeMatcher()


class MatchRequest(BaseModel):
    job_id: str
    job_description: str


@router.post("/match")
def match_resumes(req: MatchRequest):
    try:
        return matcher.match(
            job_id=req.job_id,
            job_description=req.job_description
        )
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
