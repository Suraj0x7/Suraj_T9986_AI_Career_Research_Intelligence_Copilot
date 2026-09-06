from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, TrendAnalysis
from app.schemas import ExperiencedAnalysisRequest, ExperiencedAnalysisResponse
from app.api.deps import get_current_user
from app.services.trend_service import trend_service
from app.services.notification_service import notification_service

router = APIRouter(prefix="/experienced", tags=["Experienced Career Copilot"])


@router.post("/analyze", response_model=ExperiencedAnalysisResponse)
def analyze_experienced_professional(
    data: ExperiencedAnalysisRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Compares current experience vs target job skills vs industry trending technologies."""
    result = trend_service.analyze_experienced_candidate(
        experience_text=data.current_experience,
        target_jd_text=data.target_job_description,
        years_exp=data.years_of_experience or 3.0
    )

    # Save to trend analyses table
    trend_record = TrendAnalysis(
        topic=data.target_role or "Senior Engineering",
        source_url="Controlled Industry & Job Analysis",
        extracted_keywords=result["target_skills"],
        trending_skills=result["trending_skills"],
        summary=result["next_best_action"]
    )
    db.add(trend_record)
    db.commit()

    notification_service.create_notification(
        db=db,
        user_id=user.id,
        title="Experienced Analysis Complete",
        message=f"Analyzed experience against {len(result['trending_skills'])} trending industry technologies.",
        notif_type="SUCCESS"
    )

    return result


@router.get("/trends")
async def get_industry_technology_trends():
    """Returns controlled tech trend extraction from configured public engineering sources."""
    sources = await trend_service.fetch_source_trends()
    return {
        "status": "success",
        "sources": sources,
        "industry_trending_skills": [
            "Generative AI",
            "Agentic AI",
            "LLMOps",
            "Vector Databases",
            "Kubernetes",
            "Cloud Native",
            "Kafka",
            "FastAPI"
        ]
    }
