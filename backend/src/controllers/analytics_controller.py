"""Analytics controller - track page visits"""

from typing import Optional

from litestar import Controller, Request, get, post
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from pydantic import BaseModel

from models.analytics import PageVisit
from models.page import Page


class TrackRequest(BaseModel):
    screen_resolution: Optional[str] = None
    device_memory: Optional[int] = None
    cpu_cores: Optional[int] = None
    is_touch: Optional[bool] = None


class AnalyticsController(Controller):
    path = "/analytics"
    tags = ["Analytics"]

    @post("/track/{slug:str}", status_code=HTTP_204_NO_CONTENT)
    async def track_visit(self, slug: str, request: Request, data: Optional[TrackRequest] = None) -> None:
        """Track a page visit. Called from client-side script."""
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Extract request info
        client_ip = _get_client_ip(request)
        user_agent = request.headers.get("user-agent", "")
        referer = request.headers.get("referer", "")

        # Parse user agent for device info
        device_info = _parse_user_agent(user_agent)

        # Get geo info from IP (simplified - in production use GeoIP database)
        geo_info = await _get_geo_info(client_ip)

        # Create visit record
        visit_data = {
            "page": page["id"],
            "ip_address": client_ip,
            "user_agent": user_agent,
            "referer": referer,
            "device_type": device_info.get("device_type"),
            "os": device_info.get("os"),
            "browser": device_info.get("browser"),
            "country": geo_info.get("country"),
            "city": geo_info.get("city"),
        }

        # Add client-side data if provided
        if data:
            visit_data.update({
                "screen_resolution": data.screen_resolution,
                "device_memory": data.device_memory,
                "cpu_cores": data.cpu_cores,
                "is_touch": data.is_touch,
            })

        await PageVisit.insert(PageVisit(**visit_data))

    @get("/stats")
    async def get_all_stats(self, request: Request) -> dict:
        """Get analytics stats for all pages. Admin only."""
        # Get all pages with visit stats
        pages = await Page.select()

        stats = []
        total_visits = 0
        all_unique_ips = set()

        for page in pages:
            page_visits = await PageVisit.count().where(PageVisit.page == page["id"])
            unique_ips_result = await PageVisit.raw(
                f"SELECT DISTINCT ip_address FROM page_visits WHERE page = {page['id']}"
            )
            unique_ips = [r["ip_address"] for r in unique_ips_result]

            # Get last visit
            last_visit = await PageVisit.select().where(
                PageVisit.page == page["id"]
            ).order_by(PageVisit.visited_at, ascending=False).first()

            stats.append({
                "page_slug": page["slug"],
                "total_visits": page_visits,
                "unique_visitors": len(unique_ips),
                "last_visit": last_visit["visited_at"].isoformat() if last_visit and last_visit["visited_at"] else None,
            })

            total_visits += page_visits
            all_unique_ips.update(unique_ips)

        # Sort by total visits descending
        stats.sort(key=lambda x: x["total_visits"], reverse=True)

        return {
            "stats": stats,
            "total_visits": total_visits,
            "unique_visitors": len(all_unique_ips),
        }

    @get("/recent")
    async def get_recent_visits(self, request: Request) -> dict:
        """Get recent visits across all pages. Admin only."""
        # Get recent visits with page info
        recent = await PageVisit.raw(
            """
            SELECT pv.id, pv.ip_address, pv.user_agent, pv.screen_resolution,
                   pv.visited_at, p.slug as page_slug
            FROM page_visits pv
            JOIN pages p ON pv.page = p.id
            ORDER BY pv.visited_at DESC
            LIMIT 20
            """
        )

        return {
            "visits": [
                {
                    "id": v["id"],
                    "page_slug": v["page_slug"],
                    "visitor_ip": v["ip_address"][:10] + "..." if v["ip_address"] else "unknown",
                    "user_agent": v["user_agent"] or "",
                    "screen_resolution": v["screen_resolution"] or "",
                    "visited_at": v["visited_at"].isoformat() if v["visited_at"] else None,
                }
                for v in recent
            ]
        }

    @get("/stats/{slug:str}")
    async def get_page_stats(self, slug: str, request: Request) -> dict:
        """Get analytics stats for a page. Admin only."""
        # TODO: Add admin check
        page = await Page.select().where(Page.slug == slug).first()

        if not page:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Page not found")

        # Get visit counts
        total_visits = await PageVisit.count().where(PageVisit.page == page["id"])

        # Get unique IPs
        unique_ips = await PageVisit.raw(
            f"SELECT COUNT(DISTINCT ip_address) FROM page_visits WHERE page = {page['id']}"
        )

        # Get recent visits
        recent_visits = await PageVisit.select().where(
            PageVisit.page == page["id"]
        ).order_by(PageVisit.visited_at, ascending=False).limit(10)

        return {
            "page_slug": slug,
            "total_visits": total_visits,
            "unique_visitors": unique_ips[0]["count"] if unique_ips else 0,
            "recent_visits": [
                {
                    "ip": v["ip_address"][:10] + "...",  # Truncate for privacy
                    "device": v["device_type"],
                    "browser": v["browser"],
                    "country": v["country"],
                    "visited_at": v["visited_at"].isoformat() if v["visited_at"] else None,
                }
                for v in recent_visits
            ],
        }


def _get_client_ip(request: Request) -> str:
    """Extract client IP from request headers."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _parse_user_agent(user_agent: str) -> dict:
    """Parse user agent string for device info."""
    ua_lower = user_agent.lower()

    # Device type
    device_type = "desktop"
    if "mobile" in ua_lower or "android" in ua_lower and "mobile" in ua_lower:
        device_type = "mobile"
    elif "tablet" in ua_lower or "ipad" in ua_lower:
        device_type = "tablet"

    # OS
    os = "Unknown"
    if "windows" in ua_lower:
        os = "Windows"
    elif "mac os" in ua_lower or "macos" in ua_lower:
        os = "macOS"
    elif "iphone" in ua_lower or "ipad" in ua_lower:
        os = "iOS"
    elif "android" in ua_lower:
        os = "Android"
    elif "linux" in ua_lower:
        os = "Linux"

    # Browser
    browser = "Unknown"
    if "chrome" in ua_lower and "edg" not in ua_lower:
        browser = "Chrome"
    elif "safari" in ua_lower and "chrome" not in ua_lower:
        browser = "Safari"
    elif "firefox" in ua_lower:
        browser = "Firefox"
    elif "edg" in ua_lower:
        browser = "Edge"

    return {"device_type": device_type, "os": os, "browser": browser}


async def _get_geo_info(ip_address: str) -> dict:
    """Get geo info from IP. Simplified version."""
    # In production, use a GeoIP database like MaxMind
    # For now, return empty - can be enhanced later
    if ip_address in ("127.0.0.1", "localhost", "unknown"):
        return {"country": "Local", "city": None}

    # TODO: Integrate with free IP API or GeoIP database
    return {"country": None, "city": None}
