"""Page model for access control and analytics"""

from piccolo.columns.column_types import (
    Boolean,
    Serial,
    Timestamptz,
    Varchar,
)
from piccolo.columns.defaults.timestamptz import TimestamptzNow
from piccolo.table import Table


class Page(Table, tablename="pages"):
    """Pages with optional password protection."""

    id = Serial(primary_key=True)
    slug = Varchar(length=100, unique=True, index=True)  # e.g., "cronite", "cameleon-group"
    title = Varchar(length=255)

    # Access control
    access_password = Varchar(length=255, null=True)  # Hashed password
    access_password_plain = Varchar(length=255, null=True)  # Plain for sharing URLs
    is_public = Boolean(default=True)  # Show in public listings
    require_auth = Boolean(default=False)  # Require user login (admin only)

    created_at = Timestamptz(default=TimestamptzNow())
