from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    profile_type = Column(String(100), nullable=False, default="Fresher / Student")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("CareerAnalysis", back_populates="user", cascade="all, delete-orphan")
    learning_plans = relationship("LearningPlan", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    research_papers = relationship("ResearchPaper", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_role = Column(String(255), nullable=True)
    target_role = Column(String(255), nullable=True)
    years_of_experience = Column(Float, default=0.0)
    bio = Column(Text, nullable=True)
    career_readiness_score = Column(Float, default=65.0)
    learning_streak = Column(Integer, default=1)
    skills_learned_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    raw_text = Column(Text, nullable=False)
    parsed_sections = Column(JSON, default=dict)  # education, skills, projects, experience, certifications
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resumes")
    analyses = relationship("CareerAnalysis", back_populates="resume")


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    parsed_skills = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    analyses = relationship("CareerAnalysis", back_populates="job_description")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    normalized_name = Column(String(100), index=True, nullable=False)
    category = Column(String(100), default="General")  # Programming, Cloud, Database, AI/ML, Frameworks, DevOps


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(100), default="General")
    proficiency = Column(String(50), default="Intermediate")
    source = Column(String(50), default="Resume")  # Resume, Self-Reported, Completed-Task


class CareerAnalysis(Base):
    __tablename__ = "career_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(255), nullable=True)
    match_score = Column(Float, default=0.0)
    ats_score = Column(Float, default=0.0)
    good_sections = Column(JSON, default=list)
    weak_sections = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    next_best_action = Column(Text, nullable=True)
    category_scores = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job_description = relationship("JobDescription", back_populates="analyses")
    skill_gaps = relationship("SkillGap", back_populates="analysis", cascade="all, delete-orphan")
    learning_plans = relationship("LearningPlan", back_populates="analysis")


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("career_analyses.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(100), default="General")
    status = Column(String(50), default="Missing")  # Matched, Missing, Strong, Priority
    priority_level = Column(String(20), default="High")  # High, Medium, Low
    why_learn = Column(Text, nullable=True)
    recommended_project = Column(Text, nullable=True)
    duration_days = Column(Integer, default=3)
    youtube_resources = Column(JSON, default=list)
    doc_url = Column(String(500), nullable=True)

    analysis = relationship("CareerAnalysis", back_populates="skill_gaps")


class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("career_analyses.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), default="30-Day Personalized Career Learning Plan")
    duration_days = Column(Integer, default=30)
    current_day = Column(Integer, default=1)
    total_tasks = Column(Integer, default=30)
    completed_tasks = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="learning_plans")
    analysis = relationship("CareerAnalysis", back_populates="learning_plans")
    tasks = relationship("LearningTask", back_populates="plan", cascade="all, delete-orphan")


class LearningTask(Base):
    __tablename__ = "learning_tasks"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("learning_plans.id", ondelete="CASCADE"), nullable=False)
    day_number = Column(Integer, nullable=False)
    week_number = Column(Integer, nullable=False)
    topic = Column(String(255), nullable=False)
    theory_duration = Column(String(50), default="45 min theory")
    practice_duration = Column(String(50), default="45 min practice")
    mini_task = Column(Text, nullable=False)
    resource_url = Column(String(500), nullable=True)
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED
    completed_at = Column(DateTime, nullable=True)

    plan = relationship("LearningPlan", back_populates="tasks")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # INFO, SUCCESS, WARNING, ACTION
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")


class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    title = Column(String(500), nullable=True)
    authors = Column(String(500), nullable=True)
    abstract = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=False)
    chroma_collection_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="research_papers")
    analyses = relationship("ResearchAnalysis", back_populates="paper", cascade="all, delete-orphan")


class ResearchAnalysis(Base):
    __tablename__ = "research_analyses"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("research_papers.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    problem_statement = Column(Text, nullable=True)
    research_objective = Column(Text, nullable=True)
    research_gap = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    algorithms = Column(JSON, default=list)
    dataset = Column(Text, nullable=True)
    models = Column(JSON, default=list)
    evaluation_metrics = Column(JSON, default=list)
    experimental_setup = Column(Text, nullable=True)
    key_findings = Column(JSON, default=list)
    results = Column(Text, nullable=True)
    limitations = Column(JSON, default=list)
    conclusion = Column(Text, nullable=True)
    future_work = Column(JSON, default=list)
    novelty = Column(Text, nullable=True)
    next_action_plan = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    paper = relationship("ResearchPaper", back_populates="analyses")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("career_analyses.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(255), nullable=False)
    questions = Column(JSON, default=list)  # 10 questions with topic, difficulty, question, suggested_answer
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    readiness_score = Column(Float, default=65.0)
    skills_completed = Column(Integer, default=0)
    weekly_tasks = Column(Integer, default=0)
    streak_count = Column(Integer, default=1)
    ats_score = Column(Float, default=75.0)
    match_score = Column(Float, default=70.0)
    papers_analyzed = Column(Integer, default=0)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="progress_records")


class TrendAnalysis(Base):
    __tablename__ = "trend_analyses"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=False)
    extracted_keywords = Column(JSON, default=list)
    trending_skills = Column(JSON, default=list)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
