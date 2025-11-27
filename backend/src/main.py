"""Comments API - Litestar application"""

from litestar import Litestar
from litestar.config.cors import CORSConfig
from litestar.logging import LoggingConfig
from litestar.openapi import OpenAPIConfig
from litestar.openapi.plugins import ScalarRenderPlugin
from litestar.openapi.spec import Tag

from config import settings
from db import close_database_connection_pool, open_database_connection_pool
from routes import ALL_ROUTES

app = Litestar(
    route_handlers=ALL_ROUTES,
    on_startup=[open_database_connection_pool],
    on_shutdown=[close_database_connection_pool],
    cors_config=CORSConfig(
        allow_origins=settings.cors_allowed_origins or ["*"],
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        allow_credentials=True,
    ),
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
        title="Cameleon Group - Comments API",
        version="1.0.0",
        description="API for document comments and reactions",
        path="/docs",
        render_plugins=[ScalarRenderPlugin()],
        tags=[
            Tag(
                name="Comments",
                description="Comments and reactions on document sections",
            ),
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
