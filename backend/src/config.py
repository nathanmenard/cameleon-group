"""Configuration settings for Cameleon API"""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    # Support Clever Cloud POSTGRESQL_ADDON_URI or standard DATABASE_URL
    database_url: str = os.getenv("POSTGRESQL_ADDON_URI") or os.getenv("DATABASE_URL", "postgresql://localhost/cameleon")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    cors_allowed_origins: list[str] = None
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    # Auth
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@drakkar.io")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "changeme123")

    def __post_init__(self):
        origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
        self.cors_allowed_origins = [o.strip() for o in origins.split(",") if o.strip()]


settings = Settings()
