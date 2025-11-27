"""Comment model for document feedback"""

from datetime import UTC, datetime

from piccolo.columns.column_types import (
    Boolean,
    Serial,
    Text,
    Timestamptz,
    Varchar,
)
from piccolo.columns.defaults.timestamptz import TimestamptzNow
from piccolo.table import Table


class Comment(Table, tablename="comment"):
    """Stores comments and emoji reactions on document sections."""

    id = Serial(primary_key=True)

    # Document identification
    document_id = Varchar(length=100, index=True)  # e.g., "cameleon-group-note"
    section_id = Varchar(length=100, index=True)  # e.g., "ambition", "forces"

    # Author identification (no account required)
    author_name = Varchar(length=100)
    author_token = Varchar(length=64, index=True)  # Random token for edit/delete auth

    # Content
    content = Text(null=True)  # Text comment (optional)
    emoji = Varchar(length=10, null=True)  # Reaction emoji (optional)

    # Visibility
    is_internal = Boolean(default=False)  # Confidential comments for Drakkar only

    # Timestamps
    created_at = Timestamptz(default=TimestamptzNow())
    updated_at = Timestamptz(
        default=TimestamptzNow(), auto_update=lambda: datetime.now(UTC)
    )
