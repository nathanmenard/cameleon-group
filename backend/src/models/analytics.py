"""Analytics models for page visits and password attempts"""

from datetime import UTC, datetime

from piccolo.columns.column_types import (
    Boolean,
    ForeignKey,
    Integer,
    Serial,
    Text,
    Timestamptz,
    Varchar,
)
from piccolo.columns.defaults.timestamptz import TimestamptzNow
from piccolo.table import Table

from models.page import Page


class PageVisit(Table, tablename="page_visits"):
    """Track page visits for analytics."""

    id = Serial(primary_key=True)
    page = ForeignKey(references=Page, index=True)

    # Request info
    ip_address = Varchar(length=45)  # IPv6 ready
    user_agent = Text(null=True)
    referer = Text(null=True)

    # Parsed device info
    device_type = Varchar(length=50, null=True)  # mobile, tablet, desktop
    os = Varchar(length=100, null=True)
    browser = Varchar(length=100, null=True)

    # Extended device info (from browser APIs)
    screen_resolution = Varchar(length=50, null=True)  # "1920x1080"
    device_memory = Integer(null=True)  # RAM in GB
    cpu_cores = Integer(null=True)
    is_touch = Boolean(null=True)

    # Geo (from IP lookup)
    country = Varchar(length=100, null=True)
    city = Varchar(length=100, null=True)

    visited_at = Timestamptz(default=TimestamptzNow())


class PasswordAttempt(Table, tablename="password_attempts"):
    """Track password attempts for rate limiting."""

    id = Serial(primary_key=True)
    page = ForeignKey(references=Page, index=True)
    ip_address = Varchar(length=45, index=True)
    success = Boolean()
    attempted_at = Timestamptz(default=TimestamptzNow(), index=True)
