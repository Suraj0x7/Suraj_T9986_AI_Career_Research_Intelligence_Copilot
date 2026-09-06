from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, Profile
from app.schemas import UserOut, ProfileUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=UserOut)
def get_profile(user: User = Depends(get_current_user)):
    """Fetches full user profile details."""
    return user


@router.put("", response_model=UserOut)
def update_profile(data: ProfileUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Updates user information and career goals."""
    if data.name:
        user.name = data.name.strip()

    if not user.profile:
        user.profile = Profile(user_id=user.id)
        db.add(user.profile)

    if data.current_role is not None:
        user.profile.current_role = data.current_role
    if data.target_role is not None:
        user.profile.target_role = data.target_role
    if data.years_of_experience is not None:
        user.profile.years_of_experience = data.years_of_experience
    if data.bio is not None:
        user.profile.bio = data.bio

    db.commit()
    db.refresh(user)
    return user
