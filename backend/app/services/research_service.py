import logging
from typing import Dict, Any, List
from app.services.resume_parser import resume_parser
from app.services.rag_service import rag_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class ResearchService:
    @classmethod
    def process_and_index_paper(
        cls,
        user_id: int,
        paper_id: int,
        file_path: str
    ) -> Dict[str, Any]:
        """Extracts PDF text, indexes into ChromaDB vector store, and decomposes paper structure."""
        raw_text = resume_parser.extract_text_from_pdf(file_path)
        if not raw_text or len(raw_text.strip()) < 50:
            raise ValueError("No readable text found in the uploaded research paper PDF.")

        collection_name = f"paper_{user_id}_{paper_id}"

        # 1. Index document into ChromaDB for evidence-grounded RAG
        chunk_count = rag_service.index_document(
            collection_name=collection_name,
            text=raw_text,
            metadata_common={
                "user_id": user_id,
                "document_type": "research_paper",
                "paper_id": paper_id
            }
        )

        # 2. Decompose paper into structured insights
        decomposition = gemini_service.summarize_research(raw_text)

        return {
            "raw_text": raw_text,
            "collection_name": collection_name,
            "chunk_count": chunk_count,
            "decomposition": decomposition
        }

    @classmethod
    def answer_paper_query(cls, user_id: int, paper_id: int, query: str) -> Dict[str, Any]:
        """Answers queries strictly based on the uploaded paper's retrieved chunks."""
        collection_name = f"paper_{user_id}_{paper_id}"
        return rag_service.answer_query(
            collection_name=collection_name,
            query=query,
            context_type="research",
            top_k=5
        )


research_service = ResearchService()
