"""Comment model for document feedback"""

from datetime import UTC, datetime

from piccolo.columns.column_types import (
    Boolean,
    Integer,
    Serial,
    Text,
    Timestamptz,
    Varchar,
)
from piccolo.columns.defaults.timestamptz import TimestamptzNow
from piccolo.table import Table


class Comment(Table, tablename="comment"):
    """Stores comments on selected text passages."""

    id = Serial(primary_key=True)

    # Document identification
    document_id = Varchar(length=100, index=True)  # e.g., "cameleon-group-note"
    section_id = Varchar(length=100, index=True)  # e.g., "ambition", "forces"

    # Author identification (no account required)
    author_name = Varchar(length=100)
    author_token = Varchar(length=64, index=True)  # Random token for edit/delete auth

    # Selected text context
    selected_text = Text(null=True)  # The text passage that was selected
    text_offset = Integer(null=True)  # Character offset from section start

    # Content
    content = Text()  # Comment text (required)

    # Reply threading
    parent_id = Integer(null=True, index=True)  # For reply threads

    # Status
    is_resolved = Boolean(default=False)
    is_internal = Boolean(default=False)  # Confidential comments for Drakkar only

    # Timestamps
    created_at = Timestamptz(default=TimestamptzNow())
    updated_at = Timestamptz(
        default=TimestamptzNow(), auto_update=lambda: datetime.now(UTC)
    )
