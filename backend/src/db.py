"""Database connection management"""

from piccolo.engine.postgres import PostgresEngine

from config import settings

DB = PostgresEngine(config={"dsn": settings.database_url})


async def open_database_connection_pool():
    await DB.start_connection_pool()


async def close_database_connection_pool():
    await DB.close_connection_pool()
