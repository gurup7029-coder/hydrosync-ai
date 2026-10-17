"""
Application Configuration Settings.
Loads environment variables with sensible defaults for local development
and containerized deployment on Linux on IBM Z / IBM LinuxONE.
"""

import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "HYDROSYNC AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "..", "hydrosync.db"))
    OPEN_METEO_API_URL: str = os.getenv("OPEN_METEO_API_URL", "https://api.open-meteo.com/v1/forecast")
    MODEL_ARTIFACT_PATH: str = os.getenv(
        "MODEL_ARTIFACT_PATH",
        os.path.join(os.path.dirname(__file__), "..", "..", "ml", "artifacts", "water_detector.joblib")
    )
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    IS_LINUXONE_TARGET: bool = os.getenv("IS_LINUXONE_TARGET", "false").lower() in ("true", "1")

settings = Settings()
