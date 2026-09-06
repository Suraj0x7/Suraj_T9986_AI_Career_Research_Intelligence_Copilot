import re
from typing import Dict, List, Set, Tuple, Any

# Comprehensive Canonical Skill Map with Categories
SKILL_TAXONOMY: Dict[str, Dict[str, Any]] = {
    # Programming
    "Python": {"category": "Programming"},
    "JavaScript": {"category": "Programming"},
    "TypeScript": {"category": "Programming"},
    "Java": {"category": "Programming"},
    "C++": {"category": "Programming"},
    "C#": {"category": "Programming"},
    "Go": {"category": "Programming"},
    "Rust": {"category": "Programming"},
    "SQL": {"category": "Programming"},
    "Ruby": {"category": "Programming"},
    "PHP": {"category": "Programming"},
    "Bash": {"category": "Programming"},

    # Frameworks & Libraries
    "FastAPI": {"category": "Frameworks"},
    "React": {"category": "Frameworks"},
    "Next.js": {"category": "Frameworks"},
    "Node.js": {"category": "Frameworks"},
    "Express": {"category": "Frameworks"},
    "Django": {"category": "Frameworks"},
    "Flask": {"category": "Frameworks"},
    "Spring Boot": {"category": "Frameworks"},
    "Angular": {"category": "Frameworks"},
    "Vue.js": {"category": "Frameworks"},
    "Tailwind CSS": {"category": "Frameworks"},

    # Cloud
    "AWS": {"category": "Cloud"},
    "Azure": {"category": "Cloud"},
    "Google Cloud": {"category": "Cloud"},
    "Serverless": {"category": "Cloud"},
    "EC2": {"category": "Cloud"},
    "S3": {"category": "Cloud"},
    "Lambda": {"category": "Cloud"},

    # Database
    "PostgreSQL": {"category": "Database"},
    "MySQL": {"category": "Database"},
    "MongoDB": {"category": "Database"},
    "Redis": {"category": "Database"},
    "SQLite": {"category": "Database"},
    "Elasticsearch": {"category": "Database"},
    "ChromaDB": {"category": "Database"},
    "Vector Databases": {"category": "Database"},

    # AI / ML
    "Machine Learning": {"category": "AI/ML"},
    "Deep Learning": {"category": "AI/ML"},
    "Generative AI": {"category": "AI/ML"},
    "Agentic AI": {"category": "AI/ML"},
    "LangChain": {"category": "AI/ML"},
    "RAG": {"category": "AI/ML"},
    "PyTorch": {"category": "AI/ML"},
    "TensorFlow": {"category": "AI/ML"},
    "Scikit-learn": {"category": "AI/ML"},
    "Hugging Face": {"category": "AI/ML"},
    "NLP": {"category": "AI/ML"},
    "Computer Vision": {"category": "AI/ML"},
    "LLMOps": {"category": "AI/ML"},

    # DevOps & Infrastructure
    "Docker": {"category": "DevOps"},
    "Kubernetes": {"category": "DevOps"},
    "CI/CD": {"category": "DevOps"},
    "Git": {"category": "DevOps"},
    "GitHub Actions": {"category": "DevOps"},
    "Terraform": {"category": "DevOps"},
    "Linux": {"category": "DevOps"},
    "Microservices": {"category": "DevOps"},
    "Kafka": {"category": "DevOps"},
    "Cloud Native": {"category": "DevOps"},
}

# Alias / Variations Mapping to Canonical Skill Name
SKILL_ALIASES: Dict[str, str] = {
    "python": "Python",
    "py": "Python",
    "python3": "Python",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "java": "Java",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "sql": "SQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "psql": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "redis": "Redis",
    "sqlite": "SQLite",
    "chromadb": "ChromaDB",
    "chroma": "ChromaDB",
    "vector database": "Vector Databases",
    "vector databases": "Vector Databases",
    "vector db": "Vector Databases",
    "fastapi": "FastAPI",
    "fast api": "FastAPI",
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "next": "Next.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "node": "Node.js",
    "express": "Express",
    "expressjs": "Express",
    "django": "Django",
    "flask": "Flask",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    "aws": "AWS",
    "amazon web services": "AWS",
    "azure": "Azure",
    "microsoft azure": "Azure",
    "gcp": "Google Cloud",
    "google cloud": "Google Cloud",
    "google cloud platform": "Google Cloud",
    "serverless": "Serverless",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "git": "Git",
    "github actions": "GitHub Actions",
    "terraform": "Terraform",
    "linux": "Linux",
    "microservices": "Microservices",
    "kafka": "Kafka",
    "apache kafka": "Kafka",
    "cloud native": "Cloud Native",
    "cloud-native": "Cloud Native",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "generative ai": "Generative AI",
    "gen ai": "Generative AI",
    "genai": "Generative AI",
    "agentic ai": "Agentic AI",
    "ai agents": "Agentic AI",
    "langchain": "LangChain",
    "rag": "RAG",
    "retrieval augmented generation": "RAG",
    "retrieval-augmented generation": "RAG",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "scikit-learn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "huggingface": "Hugging Face",
    "hugging face": "Hugging Face",
    "nlp": "NLP",
    "natural language processing": "NLP",
    "computer vision": "Computer Vision",
    "cv": "Computer Vision",
    "llmops": "LLMOps",
}


class SkillExtractor:
    @classmethod
    def extract_skills(cls, text: str) -> List[str]:
        """Extracts and normalizes unique skills found in the text."""
        if not text:
            return []

        lower_text = text.lower()
        extracted: Set[str] = set()

        # Sort aliases by length descending so longer phrases match first (e.g. "generative ai" before "ai")
        sorted_aliases = sorted(SKILL_ALIASES.keys(), key=len, reverse=True)

        for alias in sorted_aliases:
            # Word boundary regex with punctuation allowance
            pattern = rf"(?:\b|(?<=\W)){re.escape(alias)}(?:\b|(?=\W))"
            if re.search(pattern, lower_text):
                canonical = SKILL_ALIASES[alias]
                extracted.add(canonical)

        return sorted(list(extracted))

    @classmethod
    def get_category_for_skill(cls, skill_name: str) -> str:
        """Returns the high-level category of a canonical skill name."""
        return SKILL_TAXONOMY.get(skill_name, {}).get("category", "General")


skill_extractor = SkillExtractor()
