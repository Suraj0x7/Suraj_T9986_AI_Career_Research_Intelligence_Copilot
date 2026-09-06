from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, CareerAnalysis, ResearchPaper, LearningPlan, LearningTask
from app.schemas import DashboardStatsResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardStatsResponse)
def get_dashboard_summary(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Provides high-level KPI metrics, streaks, and Next Best Action for user dashboard."""
    # Count analyses and papers
    total_analyses = db.query(CareerAnalysis).filter(CareerAnalysis.user_id == user.id).count()
    total_papers = db.query(ResearchPaper).filter(ResearchPaper.user_id == user.id).count()

    # Learning plan tasks
    active_plan = db.query(LearningPlan).filter(LearningPlan.user_id == user.id).order_by(LearningPlan.id.desc()).first()
    skills_completed = 0
    active_goals = 3
    if active_plan:
        skills_completed = active_plan.completed_tasks
        active_goals = max(active_plan.total_tasks - active_plan.completed_tasks, 1)

    readiness = user.profile.career_readiness_score if user.profile else 72.0
    streak = user.profile.learning_streak if user.profile else 3

    # Fetch latest analysis next best action if available
    latest_analysis = db.query(CareerAnalysis).filter(CareerAnalysis.user_id == user.id).order_by(CareerAnalysis.id.desc()).first()
    if latest_analysis and latest_analysis.next_best_action:
        next_action = latest_analysis.next_best_action
    else:
        next_action = "Upload your resume in the Fresher Copilot to identify skill gaps and generate your tailored 30-day learning roadmap."

    recent_activity = []
    if latest_analysis:
        recent_activity.append({
            "title": f"Analyzed Resume for {latest_analysis.target_role or 'Target Role'}",
            "type": "Career Analysis",
            "score": f"{latest_analysis.match_score}% Match",
            "time": latest_analysis.created_at.strftime("%b %d, %Y")
        })

    latest_paper = db.query(ResearchPaper).filter(ResearchPaper.user_id == user.id).order_by(ResearchPaper.id.desc()).first()
    if latest_paper:
        recent_activity.append({
            "title": f"Indexed Paper: {latest_paper.title or latest_paper.filename}",
            "type": "Research Intelligence",
            "score": "RAG Ready",
            "time": latest_paper.created_at.strftime("%b %d, %Y")
        })

    return {
        "user_name": user.name,
        "profile_type": user.profile_type,
        "career_readiness_score": readiness,
        "skills_learned": skills_completed,
        "active_learning_goals": active_goals,
        "research_papers_analyzed": total_papers,
        "job_matches": max(total_analyses, 1),
        "learning_streak": streak,
        "next_best_action": next_action,
        "recent_activity": recent_activity
    }
