from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, Profile, Progress
from app.schemas import UserSignup, UserLogin, Token, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.notification_service import notification_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=Token)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    """Registers a new user and creates their profile."""
    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    hashed_pw = get_password_hash(data.password)
    new_user = User(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        password_hash=hashed_pw,
        profile_type=data.profile_type
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated profile
    profile = Profile(
        user_id=new_user.id,
        current_role="Student / Fresher" if "Fresher" in data.profile_type else ("Researcher" if "Research" in data.profile_type else "Software Engineer"),
        target_role="AI Engineer",
        career_readiness_score=68.0,
        learning_streak=1
    )
    db.add(profile)

    # Create initial progress record
    progress = Progress(
        user_id=new_user.id,
        readiness_score=68.0,
        skills_completed=0,
        weekly_tasks=0,
        streak_count=1,
        ats_score=75.0,
        match_score=70.0,
        papers_analyzed=0
    )
    db.add(progress)
    db.commit()

    # Seed welcome notifications
    notification_service.seed_initial_notifications(db, new_user.id)

    # Generate JWT
    token = create_access_token(subject=new_user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user and returns JWT access token."""
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(subject=user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user)):
    """Returns the authenticated user's profile."""
    return user
