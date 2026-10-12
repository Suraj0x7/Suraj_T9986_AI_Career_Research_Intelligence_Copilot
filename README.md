# AI CAREER & RESEARCH COPILOT

**Last Updated:** October 12, 2026

A production-style, full-stack AI web application delivering personalized career guidance, resume intelligence, skill gap analysis, ATS scoring, 30-day curriculum planning, technology trend benchmarking, and academic research paper RAG intelligence.

---

## System Architecture

```
                                  +---------------------------------------+
                                  |  Next.js 14 Frontend (React 18, TS)   |
                                  |  Tailwind CSS, Recharts, Lucide Icons |
                                  +-------------------+-------------------+
                                                      | (REST + JWT Bearer)
                                                      v
                                  +---------------------------------------+
                                  |    FastAPI Backend (Python 3.10+)     |
                                  +---+---------------+---------------+---+
                                      |               |               |
             +------------------------+               |               +-----------------------+
             v                                        v                                       v
+------------------------+       +------------------------+       +-------------------------------+
|  PostgreSQL Database   |       | ChromaDB Vector Store  |       | Google Gemini API (gemini-1.5)|
|  (or SQLite fallback)  |       | (LangChain Embeddings) |       | YouTube Data API / Trend Bot  |
+------------------------+       +------------------------+       +-------------------------------+
```

---

## Core Modules & Features

### 1. Authentication & Role Profiles
- JWT Authentication with bcrypt password hashing.
- Three personalized profile archetypes:
  - **Fresher / Student**
  - **Experienced Professional**
  - **Researcher**
- Profile management and goal customization.

### 2. Module 1 — Fresher Career Copilot (`/dashboard/fresher`)
- **PDF Resume Upload**: Extracts candidate information, education, experience, and skills using `pypdf`.
- **Target Job Description Analysis**: Extracts required competencies and tools.
- **Deterministic Skill Matching**: Canonical alias mapping (e.g. `postgres` &rarr; `PostgreSQL`, `k8s` &rarr; `Kubernetes`) comparing sets with category breakdown.
- **ATS Resume Scoring**: Evaluates section completeness, keyword density, and quantifiable outcomes out of 100.
- **Personalized Recommendations**: Missing skill explanations, official documentation links, mini project challenges, and curated YouTube video tutorials.
- **Career RAG Assistant**: Grounded Q&A over resume and target JD with evidence citation preview.
- **AI Interview Simulation**: Generates 10 questions across Technical, Project, Scenario, Coding, and AI/ML categories with suggested answers.

### 3. Module 2 — Experienced Career Copilot (`/dashboard/experienced`)
- **3-Way Triad Comparison**: Your Current Experience vs. Target Role Skills vs. Verified Industry Trends.
- **Controlled Trend Scraper**: Lightweight, respectful public engineering blog keyword extraction (AWS, Google Cloud, CNCF).
- **Skill Priority Classification**: High Priority (in JD & trending), Medium Priority, and Future Growth (e.g., Agentic AI, LLMOps).
- **30-Day Senior Upskill Roadmap**: Architectural focus with "Why Learn This", target JD alignment, and production projects.

### 4. Module 3 — Researcher Copilot (`/dashboard/researcher`)
- **Academic Paper Upload**: PyPDF extraction with LangChain chunking into ChromaDB vector collections.
- **16-Point Scientific Decomposition**: Title, Authors, Abstract, Problem Statement, Objective, Research Gap, Methodology, Algorithms, Dataset, Models, Metrics, Experimental Setup, Key Findings, Results, Limitations, Future Work, Novelty.
- **Grounded Research RAG**: Strict evidence grounding preventing hallucination with chunk citation previews.
- **8-Step Research Next Action Plan**: Structured methodological protocol to reproduce, extend, and publish advancements.

### 5. Learning Plan & Progress Tracking
- **30-Day Personalized Curriculum**: Daily breakdown with theory duration, practice duration, and mini task.
- **Interactive Persistence**: Mark tasks as Pending, In Progress, or Completed, dynamically updating career readiness scores.
- **Progress Tracker (`/dashboard/progress`)**: Historical ATS progression, skill match history, streak counters, and readiness curves.
- **In-App Notifications (`/dashboard/notifications`)**: Real-time alerts for analysis milestones and daily reminders.

---

## Prerequisites

Before starting, ensure you have installed:
1. [Git](https://git-scm.com/)
2. [Python 3.10+](https://www.python.org/downloads/)
3. [Node.js 18+ or 20+](https://nodejs.org/)
4. [VS Code](https://code.visualstudio.com/)
5. *(Optional for Docker)* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Quick Start with Docker (Recommended)

One single command spins up the entire full-stack application (PostgreSQL, ChromaDB, FastAPI Backend, and Next.js Frontend):

```powershell
# 1. Clone repository and navigate to project folder
cd AI_Career_Copilot

# 2. Copy environment template
Copy-Item .env.example .env

# 3. Start all services via Docker Compose
docker compose up --build
```

### Deployed Services:
- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL Database**: `localhost:5432`
- **ChromaDB Vector Store**: `localhost:8001`

---

## Local Development (Without Docker)

You can run the backend and frontend locally using Windows PowerShell:

### 1. Setup Environment Configuration
```powershell
Copy-Item .env.example .env
```
*(Optionally add your `GOOGLE_API_KEY` from [Google AI Studio](https://aistudio.google.com/) for live Gemini models. If left blank, intelligent heuristic fallbacks will operate.)*

### 2. Start the Backend (Terminal 1)
```powershell
cd backend

# Create virtual environment (Python 3.10+)
py -3.10 -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*Backend API will run at `http://localhost:8000`. Automatic SQLite database fallback is activated if local PostgreSQL is not running.*

### 3. Start the Frontend (Terminal 2)
```powershell
cd frontend

# Install node dependencies
npm install

# Start Next.js development server
npm run dev
```
*Frontend will run at `http://localhost:3000`.*

---

## Pre-configured Demo Account

To explore the dashboard without registering:
- **Email**: `demo@copilot.ai`
- **Password**: `password123`
- Or click the **"Fill Pre-configured Demo Account"** button on the `/login` screen.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user & seed initial profile |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Return authenticated user details |
| `GET` | `/api/dashboard` | Dashboard KPI metrics & Next Best Action |
| `POST` | `/api/fresher/analyze` | Upload resume PDF + JD for skill match & ATS score |
| `POST` | `/api/fresher/ask` | Evidence-grounded career RAG query |
| `POST` | `/api/fresher/interview` | Generate 10 customized technical interview questions |
| `POST` | `/api/experienced/analyze` | Experience vs JD vs Industry Trends analysis |
| `GET` | `/api/experienced/trends` | Controlled tech trend extraction from public blogs |
| `POST` | `/api/research/upload` | Upload research paper PDF & index in ChromaDB |
| `POST` | `/api/research/ask` | Evidence-grounded paper RAG with citation preview |
| `GET` | `/api/learning/plan` | Fetch active 30-day personalized learning roadmap |
| `PATCH`| `/api/learning/tasks/{id}`| Toggle task status (`COMPLETED`, `IN_PROGRESS`, `PENDING`) |
| `GET` | `/api/notifications` | Fetch in-app notifications |
| `GET` | `/api/progress` | Career readiness, ATS score history & metrics |

---

## Deployment Architecture

- **Frontend**: Deployable to **Vercel** (`npm run build`).
- **Backend**: Deployable to **AWS ECS / Azure App Service / Render** using the included `backend/Dockerfile`.
- **Database**: Managed **PostgreSQL** (AWS RDS / Supabase / Neon).
- **Vector Database**: **ChromaDB** container or cloud instance.
- **Storage**: PDF uploads configured for local storage, easily adaptable to **AWS S3** or **Azure Blob Storage**.
