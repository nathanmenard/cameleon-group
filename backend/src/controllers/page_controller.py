"""Page controller - password protection, access control, and analytics"""

import re
import secrets
import string
import unicodedata
from datetime import UTC, datetime, timedelta
from typing import Optional

from litestar import Controller, Request, Response, delete, get, patch, post
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_429_TOO_MANY_REQUESTS
from pydantic import BaseModel, Field

from auth import verify_password
from controllers.auth_controller import require_admin
from models.analytics import PageVisit, PasswordAttempt
from models.page import Page


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    # Normalize unicode characters (é -> e, etc.)
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Convert to lowercase
    text = text.lower()
    # Replace spaces and special chars with hyphens
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Remove leading/trailing hyphens
    text = text.strip('-')
    # Collapse multiple hyphens
    text = re.sub(r'-+', '-', text)
    return text


def generate_random_suffix(length: int = 5) -> str:
    """Generate a random alphanumeric suffix."""
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_slug(title: str, suffix_length: int = 5) -> str:
    """Generate a slug from title with random suffix: {title-slug}-{random}."""
    title_slug = slugify(title)
    random_suffix = generate_random_suffix(suffix_length)
    return f"{title_slug}-{random_suffix}"


def parse_user_agent(user_agent: str | None) -> tuple[str | None, str | None, str | None]:
    """Parse user agent string to extract device_type, os, and browser."""
    if not user_agent:
        return None, None, None

    ua_lower = user_agent.lower()

    # Device type detection
    device_type = "desktop"
    if "mobile" in ua_lower or "android" in ua_lower and "mobile" in ua_lower:
        device_type = "mobile"
    elif "tablet" in ua_lower or ("android" in ua_lower and "mobile" not in ua_lower):
        device_type = "tablet"
    elif "ipad" in ua_lower:
        device_type = "tablet"
    elif "iphone" in ua_lower:
        device_type = "mobile"

    # OS detection
    os_name = None
    if "windows nt 10" in ua_lower or "windows nt 11" in ua_lower:
        os_name = "Windows"
    elif "windows" in ua_lower:
        os_name = "Windows"
    elif "mac os x" in ua_lower or "macos" in ua_lower:
        os_name = "macOS"
    elif "iphone" in ua_lower or "ipad" in ua_lower:
        os_name = "iOS"
    elif "android" in ua_lower:
        os_name = "Android"
    elif "linux" in ua_lower:
        os_name = "Linux"
    elif "cros" in ua_lower:
        os_name = "ChromeOS"

    # Browser detection (order matters - more specific first)
    browser = None
    if "brave" in ua_lower:
        browser = "Brave"
    elif "vivaldi" in ua_lower:
        browser = "Vivaldi"
    elif "edg/" in ua_lower or "edge/" in ua_lower:
        browser = "Edge"
    elif "opr/" in ua_lower or "opera" in ua_lower:
        browser = "Opera"
    elif "firefox" in ua_lower:
        browser = "Firefox"
    elif "chrome" in ua_lower and "chromium" not in ua_lower:
        browser = "Chrome"
    elif "safari" in ua_lower and "chrome" not in ua_lower:
        browser = "Safari"
    elif "chromium" in ua_lower:
        browser = "Chromium"

    return device_type, os_name, browser


class PasswordRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=255)


class AccessResponse(BaseModel):
    granted: bool
    message: str


class VisitorInfo(BaseModel):
    ip: str
    country: Optional[str] = None
    count: int


class RecentVisit(BaseModel):
    ip: str
    country: Optional[str] = None
    city: Optional[str] = None
    device_type: Optional[str] = None
    os: Optional[str] = None
    browser: Optional[str] = None
    visited_at: str


class PageAnalytics(BaseModel):
    total_visits: int
    unique_visitors: int
    failed_attempts: int
    last_visit: Optional[str] = None
    top_visitors: list[VisitorInfo] = []
    recent_visits: list[RecentVisit] = []


class PageWithAnalytics(BaseModel):
    id: int
    slug: str
    title: str
    has_password: bool
    is_public: bool
    total_visits: int
    unique_visitors: int
    last_visit: Optional[str] = None


class PageDetail(BaseModel):
    id: int
    slug: str
    title: str
    has_password: bool
    is_public: bool
    analytics: PageAnalytics


class PasswordResponse(BaseModel):
    password: Optional[str] = None


class CreatePageRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    password: Optional[str] = Field(None, max_length=255)
    is_public: bool = True


class UpdatePageRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    password: Optional[str] = Field(None, max_length=255)
    is_public: Optional[bool] = None


class PageCreatedResponse(BaseModel):
    id: int
    slug: str
    title: str
    password: Optional[str] = None
    is_public: bool


class PageController(Controller):
    path = "/pages"
    tags = ["Pages"]

    @get("/")
    async def list_pages(self, request: Request) -> list[PageWithAnalytics]:
        """List all pages with their analytics (optimized single query). Admin only."""
        await require_admin(request)
        pages = await Page.select().order_by(Page.title)

        if not pages:
            return []

        # Get all slugs
        slugs = [p["slug"] for p in pages]

        # Single aggregated query for all analytics using page_slug
        analytics_query = """
            SELECT
                page_slug,
                COUNT(*) as total_visits,
                COUNT(DISTINCT visitor_ip) as unique_visitors,
                MAX(visited_at) as last_visit
            FROM page_visits
            WHERE page_slug = ANY({})
            GROUP BY page_slug
        """
        analytics_result = await Page.raw(analytics_query, slugs)

        # Create lookup dict by slug
        analytics_map = {
            row["page_slug"]: {
                "total_visits": row["total_visits"],
                "unique_visitors": row["unique_visitors"],
                "last_visit": row["last_visit"].isoformat() if row["last_visit"] else None
            }
            for row in analytics_result
        }

        result = []
        for page in pages:
            slug = page["slug"]
            analytics = analytics_map.get(slug, {"total_visits": 0, "unique_visitors": 0, "last_visit": None})

            result.append(PageWithAnalytics(
                id=page["id"],
                slug=slug,
                title=page["title"],
                has_password=bool(page["access_password"] or page["access_password_plain"]),
                is_public=page["is_public"],
                total_visits=analytics["total_visits"],
                unique_visitors=analytics["unique_visitors"],
                last_visit=analytics["last_visit"],
            ))

        return result

    @get("/{slug:str}")
    async def get_page_detail(self, slug: str, request: Request) -> PageDetail:
        """Get detailed page info with full analytics. Admin only."""
        await require_admin(request)
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Get aggregated stats
        stats_query = """
            SELECT
                COUNT(*) as total_visits,
                COUNT(DISTINCT visitor_ip) as unique_visitors,
                MAX(visited_at) as last_visit
            FROM page_visits
            WHERE page_slug = {}
        """
        stats_result = await Page.raw(stats_query, slug)
        stats = stats_result[0] if stats_result else {"total_visits": 0, "unique_visitors": 0, "last_visit": None}

        # Get failed password attempts count (last 24h)
        cutoff_24h = datetime.now(UTC) - timedelta(hours=24)
        failed_query = """
            SELECT COUNT(*) as count
            FROM password_attempts
            WHERE page = {} AND success = false AND attempted_at > {}
        """
        failed_result = await Page.raw(failed_query, page["id"], cutoff_24h)
        failed_attempts = failed_result[0]["count"] if failed_result else 0

        # Get top visitors (top 5 IPs by visit count) with country
        top_visitors_query = """
            SELECT
                visitor_ip as ip,
                country,
                COUNT(*) as count
            FROM page_visits
            WHERE page_slug = {}
            GROUP BY visitor_ip, country
            ORDER BY count DESC
            LIMIT 5
        """
        top_visitors_result = await Page.raw(top_visitors_query, slug)
        top_visitors = [
            VisitorInfo(ip=row["ip"], country=row.get("country"), count=row["count"])
            for row in top_visitors_result
        ]

        # Get recent visits (last 10)
        recent_visits_query = """
            SELECT
                visitor_ip as ip,
                user_agent,
                screen_resolution,
                country,
                city,
                device_type,
                os,
                browser,
                visited_at
            FROM page_visits
            WHERE page_slug = {}
            ORDER BY visited_at DESC
            LIMIT 10
        """
        recent_visits_result = await Page.raw(recent_visits_query, slug)
        recent_visits = []
        for row in recent_visits_result:
            # Use stored device info, or parse from user_agent if not stored
            device_type = row.get("device_type")
            os_name = row.get("os")
            browser = row.get("browser")
            if not device_type and not os_name and not browser:
                device_type, os_name, browser = parse_user_agent(row.get("user_agent"))
            recent_visits.append(RecentVisit(
                ip=row["ip"],
                country=row.get("country"),
                city=row.get("city"),
                device_type=device_type,
                os=os_name,
                browser=browser,
                visited_at=row["visited_at"].isoformat() if row["visited_at"] else None
            ))

        analytics = PageAnalytics(
            total_visits=stats["total_visits"] or 0,
            unique_visitors=stats["unique_visitors"] or 0,
            failed_attempts=failed_attempts,
            last_visit=stats["last_visit"].isoformat() if stats["last_visit"] else None,
            top_visitors=top_visitors,
            recent_visits=recent_visits,
        )

        return PageDetail(
            id=page["id"],
            slug=slug,
            title=page["title"],
            has_password=bool(page["access_password"] or page["access_password_plain"]),
            is_public=page["is_public"],
            analytics=analytics,
        )

    @get("/{slug:str}/password")
    async def get_page_password(self, slug: str, request: Request) -> PasswordResponse:
        """Get plain password for sharing. Admin only."""
        await require_admin(request)
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        return PasswordResponse(password=page["access_password_plain"])

    @get("/{slug:str}/check-access")
    async def check_access(self, slug: str, request: Request) -> AccessResponse:
        """Check if user has access to a page (via cookie or no password required)."""
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Check if password protection is enabled (either hashed or plain)
        has_password = page["access_password"] or page["access_password_plain"]
        if not has_password:
            return AccessResponse(granted=True, message="No password required")

        # Check access cookie
        cookie_name = f"page_access_{slug}"
        access_cookie = request.cookies.get(cookie_name)

        if access_cookie == "granted":
            return AccessResponse(granted=True, message="Access granted via cookie")

        return AccessResponse(granted=False, message="Password required")

    @post("/{slug:str}/verify-password")
    async def verify_page_password(
        self, slug: str, data: PasswordRequest, request: Request
    ) -> Response:
        """Verify password and grant access via cookie."""
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Get client IP
        client_ip = _get_client_ip(request)

        # Check rate limit (5 attempts per 15 minutes)
        if await _check_rate_limit(page["id"], client_ip):
            raise HTTPException(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many attempts. Try again in 15 minutes.",
            )

        # Check if password protection is enabled
        has_password = page["access_password"] or page["access_password_plain"]
        if not has_password:
            # No password set, grant access
            return _grant_access_response(slug)

        # Check against plain password (for simplicity) or hashed
        password_valid = False
        if page["access_password_plain"] and data.password == page["access_password_plain"]:
            password_valid = True
        elif page["access_password"] and verify_password(data.password, page["access_password"]):
            password_valid = True

        # Record attempt for rate limiting
        await PasswordAttempt.insert(
            PasswordAttempt(
                page=page["id"],
                ip_address=client_ip,
                success=password_valid,
            )
        )

        if not password_valid:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid password")

        return _grant_access_response(slug)

    @post("/")
    async def create_page(self, data: CreatePageRequest, request: Request) -> PageCreatedResponse:
        """Create a new page with slug format: {title-slug}-{random5chars}. Admin only."""
        await require_admin(request)

        # Generate unique slug from title
        max_attempts = 10
        slug = None
        for _ in range(max_attempts):
            candidate = generate_slug(data.title)
            existing = await Page.select().where(Page.slug == candidate).first()
            if not existing:
                slug = candidate
                break

        if not slug:
            raise HTTPException(status_code=500, detail="Could not generate unique slug")

        # Create page using raw SQL to let DB handle timestamp default
        result = await Page.raw(
            """
            INSERT INTO pages (slug, title, access_password_plain, is_public)
            VALUES ({}, {}, {}, {})
            RETURNING id
            """,
            slug,
            data.title,
            data.password,
            data.is_public,
        )
        page_id = result[0]["id"]

        return PageCreatedResponse(
            id=page_id,
            slug=slug,
            title=data.title,
            password=data.password,
            is_public=data.is_public,
        )

    @patch("/{slug:str}")
    async def update_page(self, slug: str, data: UpdatePageRequest, request: Request) -> PageDetail:
        """Update page title, password, or visibility. Admin only."""
        await require_admin(request)
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Build update dict
        updates = {}
        if data.title is not None:
            updates[Page.title] = data.title
        if data.password is not None:
            updates[Page.access_password_plain] = data.password if data.password else None
        if data.is_public is not None:
            updates[Page.is_public] = data.is_public

        if updates:
            await Page.update(updates).where(Page.slug == slug)

        # Get and return updated page
        updated_page = await Page.select().where(Page.slug == slug).first()
        return PageDetail(
            id=updated_page["id"],
            slug=slug,
            title=updated_page["title"],
            has_password=bool(updated_page["access_password"] or updated_page["access_password_plain"]),
            is_public=updated_page["is_public"],
            analytics=PageAnalytics(
                total_visits=0,
                unique_visitors=0,
                failed_attempts=0,
                last_visit=None,
                top_visitors=[],
                recent_visits=[],
            ),
        )

    @delete("/{slug:str}", status_code=200)
    async def delete_page(self, slug: str, request: Request) -> dict:
        """Delete a page and its analytics. Admin only."""
        await require_admin(request)
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Delete related analytics using raw SQL for page visits (joined by page_slug in database)
        await Page.raw("DELETE FROM page_visits WHERE page_slug = {}", slug)
        await PasswordAttempt.delete().where(PasswordAttempt.page == page["id"])

        # Delete page
        await Page.delete().where(Page.slug == slug)

        return {"deleted": True, "slug": slug}


def _get_client_ip(request: Request) -> str:
    """Extract client IP from request headers."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def _check_rate_limit(page_id: int, ip_address: str, max_attempts: int = 5, window_minutes: int = 15) -> bool:
    """Check if IP has exceeded rate limit for password attempts."""
    cutoff = datetime.now(UTC) - timedelta(minutes=window_minutes)

    # Use raw query to avoid timezone issues with Piccolo ORM
    query = """
        SELECT COUNT(*) as count
        FROM password_attempts
        WHERE page = {} AND ip_address = {} AND success = false AND attempted_at > {}
    """
    result = await Page.raw(query, page_id, ip_address, cutoff)
    failed_attempts = result[0]["count"] if result else 0

    return failed_attempts >= max_attempts


def _grant_access_response(slug: str) -> Response:
    """Create response with access cookie."""
    response = Response(
        content={"granted": True, "message": "Access granted"},
        status_code=200,
    )
    response.set_cookie(
        key=f"page_access_{slug}",
        value="granted",
        max_age=24 * 60 * 60,  # 24 hours
        httponly=True,
        samesite="lax",
        path="/",
    )
    return response
