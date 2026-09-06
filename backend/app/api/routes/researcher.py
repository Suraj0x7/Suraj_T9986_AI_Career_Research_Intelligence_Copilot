import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.models import User, ResearchPaper, ResearchAnalysis
from app.schemas import (
    ResearchAnalysisResponse, ResearchRAGQueryRequest, ResearchRAGQueryResponse, PaperListItem
)
from app.api.deps import get_current_user
from app.services.research_service import research_service
from app.services.notification_service import notification_service

router = APIRouter(prefix="/research", tags=["Researcher Copilot"])


@router.post("/upload", response_model=ResearchAnalysisResponse)
async def upload_research_paper(
    paper_file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Uploads academic research paper PDF, indexes into ChromaDB, and performs structured decomposition."""
    if not paper_file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a PDF research paper."
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    clean_name = f"paper_u{user.id}_{paper_file.filename.replace(' ', '_')}"
    file_path = os.path.join(settings.UPLOAD_DIR, clean_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(paper_file.file, buffer)

    # Create initial paper record to obtain ID
    paper = ResearchPaper(
        user_id=user.id,
        filename=paper_file.filename,
        file_path=file_path,
        raw_text=""
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)

    # Process paper, index in ChromaDB, and decompose
    try:
        proc_result = research_service.process_and_index_paper(
            user_id=user.id,
            paper_id=paper.id,
            file_path=file_path
        )
    except Exception as e:
        db.delete(paper)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse paper text: {str(e)}"
        )

    decomp = proc_result["decomposition"]

    # Update paper record with title and abstract
    paper.title = decomp.get("title") or paper_file.filename
    paper.authors = decomp.get("authors") or "Academic Authors"
    paper.abstract = decomp.get("abstract") or ""
    paper.raw_text = proc_result["raw_text"]
    paper.chroma_collection_name = proc_result["collection_name"]
    db.commit()

    # Save detailed analysis
    analysis = ResearchAnalysis(
        paper_id=paper.id,
        user_id=user.id,
        problem_statement=decomp.get("problem_statement"),
        research_objective=decomp.get("research_objective"),
        research_gap=decomp.get("research_gap"),
        methodology=decomp.get("methodology"),
        algorithms=decomp.get("algorithms", []),
        dataset=decomp.get("dataset"),
        models=decomp.get("models", []),
        evaluation_metrics=decomp.get("evaluation_metrics", []),
        experimental_setup=decomp.get("experimental_setup"),
        key_findings=decomp.get("key_findings", []),
        results=decomp.get("results"),
        limitations=decomp.get("limitations", []),
        conclusion=decomp.get("conclusion"),
        future_work=decomp.get("future_work", []),
        novelty=decomp.get("novelty"),
        next_action_plan=decomp.get("next_action_plan", [])
    )
    db.add(analysis)
    db.commit()

    notification_service.create_notification(
        db=db,
        user_id=user.id,
        title="Research Paper Analysis Ready",
        message=f"Decomposed '{paper.title[:50]}...' with RAG indexing complete.",
        notif_type="SUCCESS"
    )

    return {
        "paper_id": paper.id,
        "title": paper.title,
        "authors": paper.authors,
        "abstract": paper.abstract,
        "problem_statement": analysis.problem_statement,
        "research_objective": analysis.research_objective,
        "research_gap": analysis.research_gap,
        "methodology": analysis.methodology,
        "algorithms": analysis.algorithms,
        "dataset": analysis.dataset,
        "models": analysis.models,
        "evaluation_metrics": analysis.evaluation_metrics,
        "experimental_setup": analysis.experimental_setup,
        "key_findings": analysis.key_findings,
        "results": analysis.results,
        "limitations": analysis.limitations,
        "conclusion": analysis.conclusion,
        "future_work": analysis.future_work,
        "novelty": analysis.novelty,
        "next_action_plan": analysis.next_action_plan
    }


@router.post("/ask", response_model=ResearchRAGQueryResponse)
def ask_research_rag(
    data: ResearchRAGQueryRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Evidence-grounded RAG query over uploaded research paper with citation preview."""
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == data.paper_id, ResearchPaper.user_id == user.id).first()
    if not paper:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research paper not found.")

    res = research_service.answer_paper_query(
        user_id=user.id,
        paper_id=data.paper_id,
        query=data.query
    )
    return {
        "answer": res["answer"],
        "evidence_chunks": res.get("relevant_chunks", [])
    }


@router.get("/papers", response_model=List[PaperListItem])
def list_papers(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists all research papers uploaded by the user."""
    return db.query(ResearchPaper).filter(ResearchPaper.user_id == user.id).order_by(ResearchPaper.created_at.desc()).all()


@router.get("/papers/{paper_id}", response_model=ResearchAnalysisResponse)
def get_paper_details(paper_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieves full paper structured decomposition and research action plan."""
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id, ResearchPaper.user_id == user.id).first()
    if not paper:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found.")

    analysis = db.query(ResearchAnalysis).filter(ResearchAnalysis.paper_id == paper_id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found.")

    return {
        "paper_id": paper.id,
        "title": paper.title,
        "authors": paper.authors,
        "abstract": paper.abstract,
        "problem_statement": analysis.problem_statement,
        "research_objective": analysis.research_objective,
        "research_gap": analysis.research_gap,
        "methodology": analysis.methodology,
        "algorithms": analysis.algorithms,
        "dataset": analysis.dataset,
        "models": analysis.models,
        "evaluation_metrics": analysis.evaluation_metrics,
        "experimental_setup": analysis.experimental_setup,
        "key_findings": analysis.key_findings,
        "results": analysis.results,
        "limitations": analysis.limitations,
        "conclusion": analysis.conclusion,
        "future_work": analysis.future_work,
        "novelty": analysis.novelty,
        "next_action_plan": analysis.next_action_plan
    }
