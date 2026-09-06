from typing import List, Dict, Any
from app.services.skill_extractor import skill_extractor
from app.services.youtube_service import youtube_service

DOCUMENTATION_MAP: Dict[str, str] = {
    "Docker": "https://docs.docker.com/get-started/",
    "Kubernetes": "https://kubernetes.io/docs/tutorials/",
    "FastAPI": "https://fastapi.tiangolo.com/tutorial/",
    "LangChain": "https://python.langchain.com/docs/get_started/introduction",
    "RAG": "https://aws.amazon.com/what-is/retrieval-augmented-generation/",
    "AWS": "https://aws.amazon.com/getting-started/",
    "PostgreSQL": "https://www.postgresql.org/docs/",
    "Redis": "https://redis.io/docs/",
    "React": "https://react.dev/learn",
    "Next.js": "https://nextjs.org/docs",
    "Tailwind CSS": "https://tailwindcss.com/docs",
    "PyTorch": "https://pytorch.org/tutorials/",
    "ChromaDB": "https://docs.trychroma.com/",
    "Generative AI": "https://cloud.google.com/learn/what-is-generative-ai",
    "Agentic AI": "https://www.ibm.com/think/topics/ai-agents",
}

PROJECT_IDEAS: Dict[str, str] = {
    "Docker": "Dockerize your FastAPI & ML application with multi-stage Dockerfile and docker-compose.",
    "Kubernetes": "Deploy a microservice cluster with ConfigMaps, Secrets, and Ingress routing on Minikube.",
    "FastAPI": "Build a secure REST API with JWT authentication, SQLAlchemy models, and background tasks.",
    "LangChain": "Create a question-answering agent over custom PDF documents with semantic chunking.",
    "RAG": "Build an evidence-grounded research copilot with ChromaDB vector search and prompt grounding.",
    "AWS": "Provision an S3 bucket and deploy an automated serverless Lambda image processor.",
    "PostgreSQL": "Design a normalized database schema with foreign keys, indexes, and write migration scripts.",
    "Redis": "Implement an API rate limiter and distributed session store with Redis TTL caching.",
    "React": "Build a responsive dashboard with state management, interactive charts, and dark mode.",
    "Next.js": "Build a full-stack App Router web app with Server Components and API route handlers.",
    "Generative AI": "Build an automated code review assistant using the Gemini 1.5 API.",
}


class RecommendationService:
    @classmethod
    async def build_skill_gaps(cls, missing_skills: List[str], priority_skills: List[str]) -> List[Dict[str, Any]]:
        """Builds enriched skill gap objects with YouTube tutorials, docs, and projects."""
        gaps: List[Dict[str, Any]] = []

        for skill in missing_skills:
            category = skill_extractor.get_category_for_skill(skill)
            is_priority = skill in priority_skills
            priority_level = "High" if is_priority else "Medium"
            duration_days = 3 if is_priority else 2

            doc_url = DOCUMENTATION_MAP.get(skill, f"https://devdocs.io/#q={skill}")
            project = PROJECT_IDEAS.get(skill, f"Build an end-to-end portfolio module demonstrating practical usage of {skill}.")
            youtube_links = await youtube_service.get_tutorials_for_skill(skill)

            why_learn = (
                f"{skill} is a critical requirement in modern {category.lower()} environments. "
                f"Mastering it closes an immediate gap identified by target job descriptions."
            )

            gaps.append({
                "skill_name": skill,
                "category": category,
                "status": "Missing",
                "priority_level": priority_level,
                "why_learn": why_learn,
                "recommended_project": project,
                "duration_days": duration_days,
                "youtube_resources": youtube_links,
                "doc_url": doc_url
            })

        return gaps

    @classmethod
    def generate_30_day_plan(cls, missing_skills: List[str], target_role: str) -> List[Dict[str, Any]]:
        """Creates a comprehensive 30-day, day-by-day learning roadmap."""
        primary_skill = missing_skills[0] if len(missing_skills) > 0 else "Docker"
        secondary_skill = missing_skills[1] if len(missing_skills) > 1 else "FastAPI"
        cloud_ai_skill = missing_skills[2] if len(missing_skills) > 2 else "LangChain"

        tasks = []

        # Week 1: Foundation & Containerization
        week1_topics = [
            (1, f"{primary_skill} Architecture & Core Concepts", "45 min theory", "45 min practice", f"Install {primary_skill} and run your first verification experiment."),
            (2, f"{primary_skill} Configuration & Environment Variables", "40 min theory", "50 min practice", f"Configure multi-environment profiles using {primary_skill}."),
            (3, f"{primary_skill} Networking & Persistence", "45 min theory", "45 min practice", "Configure persistent volumes and private network communication."),
            (4, f"{secondary_skill} Integration Setup", "30 min theory", "60 min practice", f"Initialize a new repository and link {secondary_skill} dependencies."),
            (5, f"{primary_skill} + {secondary_skill} Pipeline", "30 min theory", "60 min practice", "Build a containerized service with live code reload."),
            (6, "Optimization & Multi-Stage Builds", "40 min theory", "50 min practice", "Optimize build times and reduce deployment artifact size by 50%."),
            (7, "Week 1 Capstone & Code Review", "20 min theory", "70 min practice", "Push Week 1 containerized service to GitHub with a clean README.")
        ]
        for day, topic, th, pr, task in week1_topics:
            tasks.append({
                "day_number": day, "week_number": 1, "topic": topic,
                "theory_duration": th, "practice_duration": pr, "mini_task": task,
                "resource_url": DOCUMENTATION_MAP.get(primary_skill, "https://devdocs.io")
            })

        # Week 2: Cloud, Databases & CI/CD
        week2_topics = [
            (8, "Relational Data Modeling & Indexing", "45 min theory", "45 min practice", "Design normalized PostgreSQL schemas with foreign key indexes."),
            (9, "Database Migrations & Transactions", "40 min theory", "50 min practice", "Implement database migrations and ACID transaction rollbacks."),
            (10, "Automated Testing & Pytest", "35 min theory", "55 min practice", "Write unit tests for core API endpoints and mock external calls."),
            (11, "CI/CD Pipeline with GitHub Actions", "40 min theory", "50 min practice", "Write a GitHub Actions workflow to run linting, tests, and build checks."),
            (12, "Cloud Deployment Basics (AWS / Azure)", "45 min theory", "45 min practice", "Provision cloud infrastructure and deploy a containerized service."),
            (13, "API Security & Rate Limiting", "35 min theory", "55 min practice", "Add JWT authorization middleware and token expiration guards."),
            (14, "Week 2 Milestone: Production Deployment", "20 min theory", "70 min practice", "Deploy backend live with health check monitoring enabled.")
        ]
        for day, topic, th, pr, task in week2_topics:
            tasks.append({
                "day_number": day, "week_number": 2, "topic": topic,
                "theory_duration": th, "practice_duration": pr, "mini_task": task,
                "resource_url": DOCUMENTATION_MAP.get("AWS", "https://aws.amazon.com")
            })

        # Week 3: Modern AI / RAG & Microservices
        week3_topics = [
            (15, f"{cloud_ai_skill} Principles & Vector Math", "45 min theory", "45 min practice", "Understand cosine similarity, vector embeddings, and chunking."),
            (16, "ChromaDB Indexing & Metadata Filtering", "40 min theory", "50 min practice", "Create a ChromaDB collection and store embedded document chunks."),
            (17, "Prompt Engineering & Grounding", "35 min theory", "55 min practice", "Design prompt templates enforcing strict context citations."),
            (18, "Building an End-to-End RAG Chain", "40 min theory", "50 min practice", "Connect ChromaDB retriever with Gemini / LLM generation pipeline."),
            (19, "Asynchronous Background Jobs", "45 min theory", "45 min practice", "Implement async background queues for long-running document indexing."),
            (20, "Observability & Error Tracing", "35 min theory", "55 min practice", "Add structured JSON logging and exception capture across services."),
            (21, "Week 3 Milestone: Working AI RAG Pipeline", "20 min theory", "70 min practice", "Benchmark RAG retrieval accuracy across 20 test questions.")
        ]
        for day, topic, th, pr, task in week3_topics:
            tasks.append({
                "day_number": day, "week_number": 3, "topic": topic,
                "theory_duration": th, "practice_duration": pr, "mini_task": task,
                "resource_url": DOCUMENTATION_MAP.get(cloud_ai_skill, "https://docs.trychroma.com")
            })

        # Week 4: Capstone Integration & Interview Prep
        week4_topics = [
            (22, "Full-Stack UI Connection", "30 min theory", "60 min practice", "Connect Next.js frontend state to backend REST endpoints."),
            (23, "Performance Profiling & Latency Tuning", "40 min theory", "50 min practice", "Profile endpoint response latency and add Redis caching."),
            (24, "System Design: Scalable Microservices", "50 min theory", "40 min practice", "Diagram an event-driven architecture with message queues."),
            (25, "Resume Revision & Metrics Quantification", "30 min theory", "60 min practice", "Revise resume bullet points with quantifiable impact metrics."),
            (26, "AI Technical Interview Simulation 1", "20 min theory", "70 min practice", "Complete 5 technical and coding questions in the Interview Copilot."),
            (27, "AI Technical Interview Simulation 2", "20 min theory", "70 min practice", "Practice system design and behavioral STAR scenario questions."),
            (28, "Portfolio Presentation & Demo Recording", "20 min theory", "70 min practice", "Record a 2-minute Loom demo of your containerized project."),
            (29, "Target Job Application Sprint", "15 min theory", "75 min practice", "Submit applications to 5 matched roles with tailored resumes."),
            (30, "Readiness Review & Next Growth Plan", "30 min theory", "60 min practice", "Retake the Career Readiness Assessment and map next milestone.")
        ]
        for day, topic, th, pr, task in week4_topics:
            tasks.append({
                "day_number": day, "week_number": 4, "topic": topic,
                "theory_duration": th, "practice_duration": pr, "mini_task": task,
                "resource_url": "https://github.com"
            })

        return tasks


recommendation_service = RecommendationService()
