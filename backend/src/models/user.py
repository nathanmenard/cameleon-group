"""User model for authentication"""

from piccolo.columns.column_types import (
    Boolean,
    Serial,
    Timestamptz,
    Varchar,
)
from piccolo.columns.defaults.timestamptz import TimestamptzNow
from piccolo.table import Table


class User(Table, tablename="users"):
    """Admin users for the dashboard."""

    id = Serial(primary_key=True)
    email = Varchar(length=255, unique=True, index=True)
    hashed_password = Varchar(length=255)
    first_name = Varchar(length=100, null=True)
    last_name = Varchar(length=100, null=True)
    is_admin = Boolean(default=False)
    is_active = Boolean(default=True)
    created_at = Timestamptz(default=TimestamptzNow())

    @property
    def display_name(self) -> str:
        if self.first_name or self.last_name:
            return f"{self.first_name or ''} {self.last_name or ''}".strip()
        return self.email.split("@")[0]

    @property
    def initials(self) -> str:
        if self.first_name and self.last_name:
            return f"{self.first_name[0]}{self.last_name[0]}".upper()
        return self.email[0:2].upper()
