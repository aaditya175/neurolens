"""Application configuration using Pydantic Settings with robust fallback."""

import os
from typing import List

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    
    class Settings(BaseSettings):
        PROJECT_NAME: str = "NeuroLens API"
        VERSION: str = "0.1.0"
        API_V1_STR: str = "/api/v1"
        
        # Environment
        ENV: str = "development"
        DEBUG: bool = True
        
        # Security
        SECRET_KEY: str = "neurolens-dev-insecure-secret-key-32-chars-minimum"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
        REFRESH_TOKEN_EXPIRE_DAYS: int = 7
        ALGORITHM: str = "HS256"
        
        # CORS
        BACKEND_CORS_ORIGINS: List[str] = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "https://neurolenss.netlify.app",
            "https://neurolens.netlify.app",
        ]
        
        # Database & Redis
        DATABASE_URL: str = "sqlite+aiosqlite:///./neurolens.db"
        REDIS_URL: str = "redis://localhost:6379/0"
        
        # Storage
        STORAGE_DIR: str = "./data"
        MAX_UPLOAD_SIZE_MB: int = 500
        
        # MongoDB
        MONGODB_URL: str = "mongodb://localhost:27017"
        MONGODB_DB_NAME: str = "neurolens_db"
        MONGODB_ENABLED: bool = True
        
        # ML Execution
        FAKE_MODEL: bool = True
        DEVICE: str = "cpu"
        
        # Mandatory Clinical Disclaimer
        DISCLAIMER: str = (
            "NeuroLens is a research prototype for decision support only. "
            "It is not a medical device and must not be used for clinical diagnosis or treatment decisions."
        )

        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
        )

except ImportError:
    from pydantic import BaseModel, Field

    class Settings(BaseModel):
        PROJECT_NAME: str = os.getenv("PROJECT_NAME", "NeuroLens API")
        VERSION: str = os.getenv("VERSION", "0.1.0")
        API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
        
        ENV: str = os.getenv("ENV", "development")
        DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
        
        SECRET_KEY: str = os.getenv("SECRET_KEY", "neurolens-dev-insecure-secret-key-32-chars-minimum")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
        REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
        ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        
        BACKEND_CORS_ORIGINS: List[str] = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "https://neurolenss.netlify.app",
            "https://neurolens.netlify.app",
        ]
        
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./neurolens.db")
        REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        
        STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./data")
        MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "500"))
        
        MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "neurolens_db")
        MONGODB_ENABLED: bool = os.getenv("MONGODB_ENABLED", "true").lower() == "true"
        
        FAKE_MODEL: bool = os.getenv("FAKE_MODEL", "true").lower() == "true"
        DEVICE: str = os.getenv("DEVICE", "cpu")
        
        DISCLAIMER: str = (
            "NeuroLens is a research prototype for decision support only. "
            "It is not a medical device and must not be used for clinical diagnosis or treatment decisions."
        )


settings = Settings()
