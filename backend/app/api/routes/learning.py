from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, LearningPlan, LearningTask, Progress
from app.schemas import LearningPlanOut, TaskStatusUpdate
from app.api.deps import get_current_user
from app.services.recommendation_service import recommendation_service
from app.services.notification_service import notification_service

router = APIRouter(prefix="/learning", tags=["Learning Plan"])


@router.get("/plan", response_model=LearningPlanOut)
def get_learning_plan(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches user's current 30-day learning roadmap and tasks."""
    plan = db.query(LearningPlan).filter(LearningPlan.user_id == user.id).order_by(LearningPlan.id.desc()).first()

    # If no plan exists, seed a default 30-day plan
    if not plan:
        tasks_data = recommendation_service.generate_30_day_plan(
            missing_skills=["Docker", "FastAPI", "LangChain", "Kubernetes"],
            target_role="Full Stack & AI Engineer"
        )
        plan = LearningPlan(
            user_id=user.id,
            title="30-Day Personalized Career Roadmap",
            duration_days=30,
            current_day=1,
            total_tasks=len(tasks_data),
            completed_tasks=0
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)

        for t in tasks_data:
            task = LearningTask(
                plan_id=plan.id,
                day_number=t["day_number"],
                week_number=t["week_number"],
                topic=t["topic"],
                theory_duration=t["theory_duration"],
                practice_duration=t["practice_duration"],
                mini_task=t["mini_task"],
                resource_url=t["resource_url"],
                status="PENDING"
            )
            db.add(task)
        db.commit()
        db.refresh(plan)

    return plan


@router.patch("/tasks/{task_id}", response_model=LearningPlanOut)
def update_task_status(
    task_id: int,
    update: TaskStatusUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates learning task status (PENDING, IN_PROGRESS, COMPLETED) and recalibrates progress metrics."""
    task = db.query(LearningTask).join(LearningPlan).filter(
        LearningTask.id == task_id,
        LearningPlan.user_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learning task not found.")

    prev_status = task.status
    task.status = update.status.upper()
    if task.status == "COMPLETED":
        task.completed_at = datetime.now(timezone.utc)
    else:
        task.completed_at = None

    plan = task.plan

    # Recalculate completed count
    completed_count = db.query(LearningTask).filter(
        LearningTask.plan_id == plan.id,
        LearningTask.status == "COMPLETED"
    ).count()
    plan.completed_tasks = completed_count

    # Update profile skills count
    if user.profile:
        user.profile.skills_learned_count = completed_count
        if prev_status != "COMPLETED" and task.status == "COMPLETED":
            user.profile.learning_streak = min(user.profile.learning_streak + 1, 30)
            user.profile.career_readiness_score = min(user.profile.career_readiness_score + 1.0, 99.0)

    db.commit()
    db.refresh(plan)

    if task.status == "COMPLETED":
        notification_service.create_notification(
            db=db,
            user_id=user.id,
            title=f"Task Completed: Day {task.day_number}",
            message=f"Great job completing '{task.topic}'! Your career readiness score increased.",
            notif_type="SUCCESS"
        )

    return plan
