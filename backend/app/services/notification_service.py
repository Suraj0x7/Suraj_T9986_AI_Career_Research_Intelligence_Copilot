from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Notification


class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notif_type: str = "INFO"
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            is_read=False
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        return notif

    @staticmethod
    def seed_initial_notifications(db: Session, user_id: int):
        defaults = [
            ("Welcome to AI Career & Research Copilot", "Get started by selecting your target role or uploading your resume in the Fresher or Experienced copilot.", "SUCCESS"),
            ("Personalized 30-Day Plan Ready", "Check out your learning roadmap to track your daily practice tasks.", "INFO"),
            ("Research Intelligence Active", "Upload your first research paper to generate automated gap analyses and grounded Q&A.", "INFO")
        ]
        for title, msg, ntype in defaults:
            NotificationService.create_notification(db, user_id, title, msg, ntype)

    @staticmethod
    def get_user_notifications(db: Session, user_id: int, limit: int = 20) -> List[Notification]:
        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def mark_as_read(db: Session, user_id: int, notification_id: int) -> Optional[Notification]:
        notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            db.refresh(notif)
        return notif

    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> int:
        updated = (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .update({"is_read": True})
        )
        db.commit()
        return updated


notification_service = NotificationService()
