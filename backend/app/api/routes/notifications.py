from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User
from app.schemas import NotificationOut
from app.api.deps import get_current_user
from app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationOut])
def get_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches user notifications sorted by recent first."""
    return notification_service.get_user_notifications(db=db, user_id=user.id)


@router.patch("/{notification_id}/read", response_model=NotificationOut)
def mark_read(notification_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Marks a single notification as read."""
    notif = notification_service.mark_as_read(db=db, user_id=user.id, notification_id=notification_id)
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    return notif


@router.post("/read-all")
def mark_all_read(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Marks all user notifications as read."""
    count = notification_service.mark_all_as_read(db=db, user_id=user.id)
    return {"status": "success", "marked_read_count": count}
