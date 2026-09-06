from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


# -------------------------------------------------------------
# AUTH SCHEMAS
# -------------------------------------------------------------
class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    profile_type: str = Field(default="Fresher / Student")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class ProfileOut(BaseModel):
    id: int
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    years_of_experience: float = 0.0
    bio: Optional[str] = None
    career_readiness_score: float = 65.0
    learning_streak: int = 1
    skills_learned_count: int = 0

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    profile_type: str
    created_at: datetime
    profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    years_of_experience: Optional[float] = None
    bio: Optional[str] = None


# -------------------------------------------------------------
# SKILLS & CAREER ANALYSIS SCHEMAS
# -------------------------------------------------------------
class SkillGapItem(BaseModel):
    skill_name: str
    category: str
    status: str  # Matched, Missing, Strong, Priority
    priority_level: str  # High, Medium, Low
    why_learn: Optional[str] = None
    recommended_project: Optional[str] = None
    duration_days: int = 3
    youtube_resources: Optional[List[Dict[str, str]]] = []
    doc_url: Optional[str] = None


class CareerAnalysisResponse(BaseModel):
    analysis_id: int
    candidate_name: Optional[str] = "Candidate"
    target_role: Optional[str] = "Software Engineer"
    match_score: float
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    strong_skills: List[str]
    priority_skills: List[str]
    category_scores: Dict[str, Dict[str, Any]]
    good_sections: List[str]
    weak_sections: List[str]
    missing_keywords: List[str]
    recommendations: List[str]
    next_best_action: str
    skill_gaps: List[SkillGapItem]


class CareerRAGQueryRequest(BaseModel):
    analysis_id: int
    query: str


class CareerRAGQueryResponse(BaseModel):
    answer: str
    relevant_chunks: List[str] = []


# -------------------------------------------------------------
# INTERVIEW PREPARATION SCHEMAS
# -------------------------------------------------------------
class InterviewQuestionItem(BaseModel):
    id: int
    category: str  # Technical, Project, HR, Scenario, Coding, AI/ML
    topic: str
    difficulty: str  # Beginner, Intermediate, Advanced
    question: str
    suggested_answer: str


class InterviewGenerateRequest(BaseModel):
    analysis_id: Optional[int] = None
    target_role: Optional[str] = "Full Stack Engineer"


class InterviewGenerateResponse(BaseModel):
    target_role: str
    questions: List[InterviewQuestionItem]


# -------------------------------------------------------------
# LEARNING PLAN SCHEMAS
# -------------------------------------------------------------
class LearningTaskOut(BaseModel):
    id: int
    day_number: int
    week_number: int
    topic: str
    theory_duration: str
    practice_duration: str
    mini_task: str
    resource_url: Optional[str] = None
    status: str
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LearningPlanOut(BaseModel):
    id: int
    title: str
    duration_days: int
    current_day: int
    total_tasks: int
    completed_tasks: int
    tasks: List[LearningTaskOut]

    class Config:
        from_attributes = True


class TaskStatusUpdate(BaseModel):
    status: str  # PENDING, IN_PROGRESS, COMPLETED


# -------------------------------------------------------------
# EXPERIENCED PROFESSIONAL SCHEMAS
# -------------------------------------------------------------
class ExperiencedAnalysisRequest(BaseModel):
    current_experience: str
    target_job_description: str
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    years_of_experience: Optional[float] = 3.0


class TrendSkillItem(BaseModel):
    skill: str
    category: str
    relevance: str  # High Priority, Medium Priority, Future Growth
    reason: str
    industry_trend: str
    recommended_project: str


class ExperiencedAnalysisResponse(BaseModel):
    current_skills: List[str]
    target_skills: List[str]
    trending_skills: List[str]
    match_score: float
    high_priority_skills: List[TrendSkillItem]
    medium_priority_skills: List[TrendSkillItem]
    future_growth_skills: List[TrendSkillItem]
    radar_data: List[Dict[str, Any]]
    thirty_day_roadmap: List[Dict[str, Any]]
    next_best_action: str


# -------------------------------------------------------------
# RESEARCHER SCHEMAS
# -------------------------------------------------------------
class ResearchAnalysisResponse(BaseModel):
    paper_id: int
    title: Optional[str] = "Research Paper"
    authors: Optional[str] = "Unknown Authors"
    abstract: Optional[str] = None
    problem_statement: Optional[str] = None
    research_objective: Optional[str] = None
    research_gap: Optional[str] = None
    methodology: Optional[str] = None
    algorithms: List[str] = []
    dataset: Optional[str] = None
    models: List[str] = []
    evaluation_metrics: List[str] = []
    experimental_setup: Optional[str] = None
    key_findings: List[str] = []
    results: Optional[str] = None
    limitations: List[str] = []
    conclusion: Optional[str] = None
    future_work: List[str] = []
    novelty: Optional[str] = None
    next_action_plan: List[Dict[str, str]] = []


class ResearchRAGQueryRequest(BaseModel):
    paper_id: int
    query: str


class ResearchRAGQueryResponse(BaseModel):
    answer: str
    evidence_chunks: List[str] = []


class PaperListItem(BaseModel):
    id: int
    title: Optional[str] = "Research Paper"
    authors: Optional[str] = "Authors"
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------------------------------------------------
# DASHBOARD & PROGRESS SCHEMAS
# -------------------------------------------------------------
class DashboardStatsResponse(BaseModel):
    user_name: str
    profile_type: str
    career_readiness_score: float
    skills_learned: int
    active_learning_goals: int
    research_papers_analyzed: int
    job_matches: int
    learning_streak: int
    next_best_action: str
    recent_activity: List[Dict[str, Any]] = []


class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProgressStatsResponse(BaseModel):
    learning_completion_pct: float
    skills_completed: int
    weekly_tasks_completed: int
    current_streak: int
    career_readiness_score: float
    ats_score_history: List[Dict[str, Any]]
    skill_match_history: List[Dict[str, Any]]
    readiness_history: List[Dict[str, Any]]
    papers_analyzed_count: int
