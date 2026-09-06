import os
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.models import (
    User, Resume, JobDescription, CareerAnalysis, SkillGap, LearningPlan, LearningTask, InterviewSession
)
from app.schemas import (
    CareerAnalysisResponse, CareerRAGQueryRequest, CareerRAGQueryResponse,
    InterviewGenerateRequest, InterviewGenerateResponse
)
from app.api.deps import get_current_user
from app.services.resume_parser import resume_parser
from app.services.skill_extractor import skill_extractor
from app.services.matching_engine import matching_engine
from app.services.recommendation_service import recommendation_service
from app.services.rag_service import rag_service
from app.services.gemini_service import gemini_service
from app.services.notification_service import notification_service

router = APIRouter(prefix="/fresher", tags=["Fresher Career Copilot"])


@router.post("/analyze", response_model=CareerAnalysisResponse)
async def analyze_fresher_career(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    target_role: Optional[str] = Form("AI / Full Stack Engineer"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Parses resume PDF, performs deterministic skill matching, computes ATS score, and indexes for RAG."""
    if not resume_file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a valid PDF document."
        )

    # Save uploaded file
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    clean_filename = f"user_{user.id}_{resume_file.filename.replace(' ', '_')}"
    file_path = os.path.join(settings.UPLOAD_DIR, clean_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume_file.file, buffer)

    # 1. Parse Resume Text & Sections
    try:
        resume_text = resume_parser.extract_text_from_pdf(file_path)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not read PDF contents: {str(e)}"
        )

    if not resume_text or len(resume_text.strip()) < 40:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No readable text detected in resume. Please ensure the PDF contains selectable text."
        )

    parsed_data = resume_parser.parse_sections(resume_text)
    candidate_name = parsed_data.get("candidate_name") or user.name

    # 2. Extract Skills
    resume_skills = skill_extractor.extract_skills(resume_text)
    jd_skills = skill_extractor.extract_skills(job_description)

    # Ensure baseline job skills if input was sparse
    if not jd_skills:
        jd_skills = ["Python", "SQL", "Docker", "FastAPI", "PostgreSQL", "Git"]

    # 3. Match Skills & Calculate ATS
    match_result = matching_engine.compare_skills(resume_skills, jd_skills)
    ats_result = matching_engine.calculate_ats_score(
        resume_text=resume_text,
        sections=parsed_data.get("sections", {}),
        resume_skills=resume_skills,
        jd_skills=jd_skills
    )

    # 4. Enriched Skill Gaps & Recommendations
    skill_gaps_data = await recommendation_service.build_skill_gaps(
        missing_skills=match_result["missing_skills"],
        priority_skills=match_result["priority_skills"]
    )

    # 5. Database Persistence
    db_resume = Resume(
        user_id=user.id,
        filename=resume_file.filename,
        file_path=file_path,
        raw_text=resume_text,
        parsed_sections=parsed_data.get("sections", {})
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    db_jd = JobDescription(
        user_id=user.id,
        title=target_role,
        company="Target Company",
        raw_text=job_description,
        parsed_skills=jd_skills
    )
    db.add(db_jd)
    db.commit()
    db.refresh(db_jd)

    analysis = CareerAnalysis(
        user_id=user.id,
        resume_id=db_resume.id,
        job_id=db_jd.id,
        target_role=target_role,
        match_score=match_result["match_score"],
        ats_score=ats_result["ats_score"],
        good_sections=ats_result["good_sections"],
        weak_sections=ats_result["weak_sections"],
        missing_keywords=ats_result["missing_keywords"],
        recommendations=ats_result["recommendations"],
        next_best_action=ats_result["next_best_action"],
        category_scores=match_result["category_scores"]
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Save skill gaps
    for gap in skill_gaps_data:
        db_gap = SkillGap(
            analysis_id=analysis.id,
            skill_name=gap["skill_name"],
            category=gap["category"],
            status="Missing",
            priority_level=gap["priority_level"],
            why_learn=gap["why_learn"],
            recommended_project=gap["recommended_project"],
            duration_days=gap["duration_days"],
            youtube_resources=gap["youtube_resources"],
            doc_url=gap["doc_url"]
        )
        db.add(db_gap)

    # 6. Generate & Seed 30-Day Learning Plan
    plan_tasks = recommendation_service.generate_30_day_plan(
        missing_skills=match_result["missing_skills"],
        target_role=target_role
    )
    new_plan = LearningPlan(
        user_id=user.id,
        analysis_id=analysis.id,
        title=f"30-Day Personalized Roadmap for {target_role}",
        duration_days=30,
        current_day=1,
        total_tasks=len(plan_tasks),
        completed_tasks=0
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    for task in plan_tasks:
        db_task = LearningTask(
            plan_id=new_plan.id,
            day_number=task["day_number"],
            week_number=task["week_number"],
            topic=task["topic"],
            theory_duration=task["theory_duration"],
            practice_duration=task["practice_duration"],
            mini_task=task["mini_task"],
            resource_url=task["resource_url"],
            status="PENDING"
        )
        db.add(db_task)
    db.commit()

    # 7. Index Resume & JD in ChromaDB for Career RAG
    combined_rag_text = (
        f"=== CANDIDATE RESUME ===\n{resume_text}\n\n"
        f"=== TARGET JOB DESCRIPTION ===\nRole: {target_role}\n{job_description}"
    )
    collection_name = f"resume_{user.id}_{analysis.id}"
    rag_service.index_document(
        collection_name=collection_name,
        text=combined_rag_text,
        metadata_common={
            "user_id": user.id,
            "analysis_id": analysis.id,
            "document_type": "career_analysis"
        }
    )

    # 8. Trigger Notification
    notification_service.create_notification(
        db=db,
        user_id=user.id,
        title="Career Analysis Complete",
        message=f"Resume match calculated at {match_result['match_score']}% with ATS score {ats_result['ats_score']}/100.",
        notif_type="SUCCESS"
    )

    # Update user profile score
    if user.profile:
        user.profile.career_readiness_score = max(match_result["match_score"], ats_result["ats_score"])
        user.profile.target_role = target_role
        db.commit()

    return {
        "analysis_id": analysis.id,
        "candidate_name": candidate_name,
        "target_role": target_role,
        "match_score": match_result["match_score"],
        "ats_score": ats_result["ats_score"],
        "matched_skills": match_result["matched_skills"],
        "missing_skills": match_result["missing_skills"],
        "strong_skills": match_result["strong_skills"],
        "priority_skills": match_result["priority_skills"],
        "category_scores": match_result["category_scores"],
        "good_sections": ats_result["good_sections"],
        "weak_sections": ats_result["weak_sections"],
        "missing_keywords": ats_result["missing_keywords"],
        "recommendations": ats_result["recommendations"],
        "next_best_action": ats_result["next_best_action"],
        "skill_gaps": skill_gaps_data
    }


@router.post("/ask", response_model=CareerRAGQueryResponse)
def ask_career_rag(
    data: CareerRAGQueryRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Evidence-grounded RAG query over user resume and target job description."""
    collection_name = f"resume_{user.id}_{data.analysis_id}"
    result = rag_service.answer_query(
        collection_name=collection_name,
        query=data.query,
        context_type="career"
    )
    return {
        "answer": result["answer"],
        "relevant_chunks": result.get("relevant_chunks", [])
    }


@router.post("/interview", response_model=InterviewGenerateResponse)
def generate_interview_questions(
    data: InterviewGenerateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates 10 comprehensive interview questions tailored to resume, JD, and skill gaps."""
    # Retrieve latest analysis if available
    analysis = None
    if data.analysis_id:
        analysis = db.query(CareerAnalysis).filter(CareerAnalysis.id == data.analysis_id, CareerAnalysis.user_id == user.id).first()
    if not analysis:
        analysis = db.query(CareerAnalysis).filter(CareerAnalysis.user_id == user.id).order_by(CareerAnalysis.id.desc()).first()

    resume_text = analysis.resume.raw_text if analysis and analysis.resume else "Candidate has experience with Python, FastAPI, and SQL."
    jd_text = analysis.job_description.raw_text if analysis and analysis.job_description else "Seeking an engineer proficient in Docker, AWS, and RAG architectures."
    missing_skills = [gap.skill_name for gap in analysis.skill_gaps] if analysis and analysis.skill_gaps else ["Docker", "Kubernetes", "AWS", "RAG"]
    role = data.target_role or (analysis.target_role if analysis else "AI Engineer")

    questions = gemini_service.generate_interview_questions(
        resume_text=resume_text,
        jd_text=jd_text,
        missing_skills=missing_skills,
        target_role=role
    )

    # Save interview session
    session = InterviewSession(
        user_id=user.id,
        analysis_id=analysis.id if analysis else None,
        target_role=role,
        questions=questions
    )
    db.add(session)
    db.commit()

    return {
        "target_role": role,
        "questions": questions
    }
