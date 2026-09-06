import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.models import User, Profile, Progress
from app.core.security import get_password_hash
from app.services.notification_service import notification_service

# Import route handlers
from app.api.routes import (
    auth,
    profile,
    dashboard,
    fresher,
    experienced,
    researcher,
    learning,
    notifications,
    progress
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("career_copilot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database tables and default demo account on startup."""
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified.")

        # Seed demo user if no users exist
        db = SessionLocal()
        try:
            user_count = db.query(User).count()
            if user_count == 0:
                logger.info("Seeding default demo user...")
                demo_user = User(
                    name="Alex Mercer",
                    email="demo@copilot.ai",
                    password_hash=get_password_hash("password123"),
                    profile_type="Fresher / Student"
                )
                db.add(demo_user)
                db.commit()
                db.refresh(demo_user)

                demo_profile = Profile(
                    user_id=demo_user.id,
                    current_role="Computer Science Graduate",
                    target_role="AI & Full Stack Engineer",
                    years_of_experience=1.0,
                    bio="Passionate about building scalable AI-native web platforms and high-throughput systems.",
                    career_readiness_score=78.0,
                    learning_streak=5,
                    skills_learned_count=4
                )
                db.add(demo_profile)

                demo_progress = Progress(
                    user_id=demo_user.id,
                    readiness_score=78.0,
                    skills_completed=4,
                    weekly_tasks=3,
                    streak_count=5,
                    ats_score=82.0,
                    match_score=75.0,
                    papers_analyzed=1
                )
                db.add(demo_progress)
                db.commit()

                notification_service.seed_initial_notifications(db, demo_user.id)
                logger.info("Demo account seeded successfully (demo@copilot.ai / password123)")
        finally:
            db.close()
    except Exception as e:
        logger.error("Database initialization error: %s", e)

    yield
    logger.info("Application shutdown.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade full-stack AI Career & Research Copilot backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and docker
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }


# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(fresher.router, prefix=settings.API_V1_STR)
app.include_router(experienced.router, prefix=settings.API_V1_STR)
app.include_router(researcher.router, prefix=settings.API_V1_STR)
app.include_router(learning.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
