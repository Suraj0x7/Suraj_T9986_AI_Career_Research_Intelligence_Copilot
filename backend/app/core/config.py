import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Career & Research Copilot"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"

    # Database: Supports Postgres or SQLite dev fallback
    DATABASE_URL: str = "sqlite:///./career_copilot.db"

    # Security & JWT
    SECRET_KEY: str = "dev_secret_key_career_copilot_9823472938472938472394723984"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # AI & External APIs
    GOOGLE_API_KEY: Optional[str] = None
    YOUTUBE_API_KEY: Optional[str] = None

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8001
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"

    # Uploads
    UPLOAD_DIR: str = "./uploads"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
