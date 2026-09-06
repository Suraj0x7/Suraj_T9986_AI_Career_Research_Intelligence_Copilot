import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

connect_args = {}
database_url = settings.DATABASE_URL

if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(database_url, connect_args=connect_args, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info("Successfully connected to database: %s", database_url.split("@")[-1] if "@" in database_url else database_url)
except Exception as e:
    logger.warning("Failed to connect to configured DATABASE_URL (%s): %s. Falling back to local SQLite database.", database_url, e)
    database_url = "sqlite:///./career_copilot.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(database_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
