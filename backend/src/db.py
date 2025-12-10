"""Database connection management"""

from piccolo.engine.postgres import PostgresEngine

from config import settings

DB = PostgresEngine(config={"dsn": settings.database_url})


async def open_database_connection_pool():
    # Use small pool for Clever Cloud free tier (max 2 connections)
    await DB.start_connection_pool(min_size=1, max_size=2)


async def close_database_connection_pool():
    await DB.close_connection_pool()
