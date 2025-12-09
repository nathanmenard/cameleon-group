"""Cameleon API - Litestar application"""

from litestar import Litestar
from litestar.config.cors import CORSConfig
from litestar.logging import LoggingConfig
from litestar.openapi import OpenAPIConfig
from litestar.openapi.plugins import ScalarRenderPlugin
from litestar.openapi.spec import Tag

from config import settings
from db import close_database_connection_pool, open_database_connection_pool
from routes import ALL_ROUTES


async def init_admin_user() -> None:
    """Create default admin user if not exists."""
    from auth import get_password_hash
    from models.user import User

    existing = await User.select().where(User.email == settings.admin_email).first()
    if not existing:
        await User.insert(
            User(
                email=settings.admin_email,
                hashed_password=get_password_hash(settings.admin_password),
                first_name="Admin",
                is_admin=True,
                is_active=True,
            )
        )
        print(f"Created admin user: {settings.admin_email}")


async def startup() -> None:
    """Startup tasks."""
    await open_database_connection_pool()
    await init_admin_user()


def get_cors_config() -> CORSConfig:
    """Build CORS config from settings."""
    # In debug mode or if no origins configured, allow localhost development
    if settings.debug or not settings.cors_allowed_origins:
        origins = [
            "http://localhost:3000",
            "http://localhost:3005",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3005",
        ]
    else:
        origins = settings.cors_allowed_origins

    return CORSConfig(
        allow_origins=origins,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        allow_credentials=True,
    )


app = Litestar(
    route_handlers=ALL_ROUTES,
    on_startup=[startup],
    on_shutdown=[close_database_connection_pool],
    cors_config=get_cors_config(),
    logging_config=LoggingConfig(
        log_exceptions="debug",
        loggers={
            "litestar": {
                "level": "INFO",
                "handlers": ["queue_listener"],
            },
        },
    ),
    debug=settings.debug,
    openapi_config=OpenAPIConfig(
        title="Cameleon Group API",
        version="2.0.0",
        description="API for strategic notes - auth, analytics, comments",
        path="/docs",
        render_plugins=[ScalarRenderPlugin()],
        tags=[
            Tag(name="Auth", description="Authentication and user management"),
            Tag(name="Pages", description="Page access control and password protection"),
            Tag(name="Analytics", description="Page visit tracking"),
            Tag(name="Comments", description="Document comments and reactions"),
        ],
    )
    if settings.debug
    else None,
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
