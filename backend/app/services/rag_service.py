import os
import re
import logging
from typing import List, Dict, Any, Optional
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    except ImportError:
        # Fallback pure-python splitter if neither package is available
        class RecursiveCharacterTextSplitter:  # type: ignore
            def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 180, separators: Optional[List[str]] = None):
                self.chunk_size = chunk_size
                self.chunk_overlap = chunk_overlap
                self.separators = separators or ["\n\n", "\n", ". ", " ", ""]

            def split_text(self, text: str) -> List[str]:
                if not text:
                    return []
                chunks = []
                start = 0
                while start < len(text):
                    end = min(start + self.chunk_size, len(text))
                    chunks.append(text[start:end])
                    if end == len(text):
                        break
                    start += max(1, self.chunk_size - self.chunk_overlap)
                return chunks
from app.core.config import settings
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

# Initialize ChromaDB client with persistent fallback
chroma_client = None
try:
    import chromadb
    from chromadb.config import Settings as ChromaSettings
    # Try local persistent client first or HTTP client if host configured
    if settings.CHROMA_HOST and settings.CHROMA_HOST != "localhost":
        try:
            chroma_client = chromadb.HttpClient(
                host=settings.CHROMA_HOST,
                port=settings.CHROMA_PORT
            )
            logger.info("Connected to ChromaDB server at %s:%s", settings.CHROMA_HOST, settings.CHROMA_PORT)
        except Exception:
            chroma_client = None

    if chroma_client is None:
        chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIRECTORY)
        logger.info("Initialized ChromaDB PersistentClient at %s", settings.CHROMA_PERSIST_DIRECTORY)
except Exception as e:
    logger.warning("ChromaDB initialization failed: %s. Using in-memory store fallback.", e)
    chroma_client = None

# In-memory document fallback store if ChromaDB is unavailable
IN_MEMORY_STORE: Dict[str, List[Dict[str, Any]]] = {}


class RAGService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=180,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def _sanitize_collection_name(self, name: str) -> str:
        """Chroma requires 3-63 chars, alphanumeric, dashes or underscores."""
        clean = re.sub(r"[^a-zA-Z0-9_\-]", "_", name)
        if len(clean) < 3:
            clean = f"col_{clean}"
        return clean[:63]

    def index_document(
        self,
        collection_name: str,
        text: str,
        metadata_common: Dict[str, Any]
    ) -> int:
        """Splits document text and indexes chunks into vector collection."""
        if not text or not text.strip():
            return 0

        chunks = self.text_splitter.split_text(text)
        safe_name = self._sanitize_collection_name(collection_name)

        if chroma_client is not None:
            try:
                # Delete existing collection if re-indexing
                try:
                    chroma_client.delete_collection(safe_name)
                except Exception:
                    pass

                collection = chroma_client.create_collection(name=safe_name)
                ids = [f"{safe_name}_{i}" for i in range(len(chunks))]
                metadatas = [{**metadata_common, "chunk_index": i} for i in range(len(chunks))]

                collection.add(
                    documents=chunks,
                    ids=ids,
                    metadatas=metadatas
                )
                logger.info("Indexed %d chunks into ChromaDB collection '%s'", len(chunks), safe_name)
                return len(chunks)
            except Exception as e:
                logger.warning("ChromaDB indexing error: %s. Falling back to in-memory store.", e)

        # In-memory fallback
        IN_MEMORY_STORE[safe_name] = [
            {"text": chunk, "metadata": {**metadata_common, "chunk_index": i}}
            for i, chunk in enumerate(chunks)
        ]
        return len(chunks)

    def retrieve_context(self, collection_name: str, query: str, top_k: int = 5) -> List[str]:
        """Retrieves most relevant chunks for a user query."""
        safe_name = self._sanitize_collection_name(collection_name)

        if chroma_client is not None:
            try:
                collection = chroma_client.get_collection(name=safe_name)
                results = collection.query(
                    query_texts=[query],
                    n_results=min(top_k, collection.count() or 1)
                )
                if results and results.get("documents") and len(results["documents"]) > 0:
                    return results["documents"][0]
            except Exception as e:
                logger.warning("ChromaDB query failed for '%s': %s. Using in-memory search.", safe_name, e)

        # In-memory keyword overlap similarity search
        chunks_data = IN_MEMORY_STORE.get(safe_name, [])
        if not chunks_data:
            return []

        query_terms = set(re.findall(r"\w+", query.lower()))
        scored = []
        for item in chunks_data:
            doc_terms = set(re.findall(r"\w+", item["text"].lower()))
            overlap = len(query_terms.intersection(doc_terms))
            scored.append((overlap, item["text"]))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [text for score, text in scored[:top_k]]

    def answer_query(
        self,
        collection_name: str,
        query: str,
        context_type: str = "career",
        top_k: int = 5
    ) -> Dict[str, Any]:
        """Performs grounded RAG query answering strictly against retrieved chunks."""
        chunks = self.retrieve_context(collection_name, query, top_k=top_k)

        if not chunks:
            return {
                "answer": "The uploaded document does not provide sufficient information to answer this question.",
                "relevant_chunks": []
            }

        context_str = "\n\n---\n\n".join(chunks)

        system_instruction = (
            "You are an evidence-grounded career and research intelligence assistant. "
            "Answer using ONLY the retrieved context provided below. "
            "If the context does not contain sufficient information to answer truthfully, explicitly state: "
            "'The uploaded document does not provide sufficient information.'"
        )

        user_prompt = f"""
RETRIEVED CONTEXT:
{context_str}

USER QUESTION:
{query}

Ground your entire answer in the retrieved context. Be direct, structured, and helpful.
"""

        answer = gemini_service.generate_text(user_prompt, system_instruction=system_instruction)

        return {
            "answer": answer,
            "relevant_chunks": chunks[:3]  # Return top 3 chunks for evidence preview
        }


rag_service = RAGService()
