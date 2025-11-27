"""Configuration settings for the comments API"""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "postgresql://localhost/cameleon_comments")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    cors_allowed_origins: list[str] = None
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    def __post_init__(self):
        origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
        self.cors_allowed_origins = [o.strip() for o in origins.split(",") if o.strip()]


settings = Settings()
