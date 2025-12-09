"""Authentication controller - login, logout, and user management"""

from typing import Optional

from litestar import Controller, Request, Response, get, post
from litestar.exceptions import HTTPException
from litestar.status_codes import (
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_429_TOO_MANY_REQUESTS,
)
from pydantic import BaseModel

from auth import (
    check_rate_limit,
    clear_login_attempts,
    create_access_token,
    decode_access_token,
    record_login_attempt,
    verify_password,
)
from config import settings
from models.user import User


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_admin: bool
    display_name: str


def _get_client_ip(request: Request) -> str:
    """Extract client IP from request headers."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class AuthController(Controller):
    path = "/auth"
    tags = ["Auth"]

    @post("/login")
    async def login(self, data: LoginRequest, request: Request) -> Response:
        """Login with email and password, returns JWT in httponly cookie."""
        client_ip = _get_client_ip(request)

        # Check rate limit
        is_blocked, remaining = check_rate_limit(client_ip)
        if is_blocked:
            raise HTTPException(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many login attempts. Try again in {remaining // 60} minutes.",
            )

        user = await User.select().where(User.email == data.email).first()

        if not user or not verify_password(data.password, user["hashed_password"]):
            record_login_attempt(client_ip)
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not user["is_active"]:
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Account disabled")

        if not user["is_admin"]:
            record_login_attempt(client_ip)
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Admin access required")

        # Clear rate limit on success
        clear_login_attempts(client_ip)

        # Create JWT token
        token = create_access_token({"sub": user["email"], "admin": user["is_admin"]})

        response = Response(
            content={
                "message": "Login successful",
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "first_name": user["first_name"],
                    "last_name": user["last_name"],
                    "is_admin": user["is_admin"],
                },
            },
            status_code=200,
        )
        response.set_cookie(
            key="access_token",
            value=token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=not settings.debug,  # False in dev, True in prod
            samesite="lax",
            path="/",
        )
        return response

    @post("/logout")
    async def logout(self) -> Response:
        """Logout - clear the auth cookie."""
        response = Response(content={"message": "Logged out"}, status_code=200)
        response.delete_cookie(key="access_token", path="/")
        return response

    @get("/me")
    async def get_current_user(self, request: Request) -> UserResponse:
        """Get current authenticated user."""
        user = await get_user_from_request(request)
        if not user:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Not authenticated")

        return UserResponse(
            id=user["id"],
            email=user["email"],
            first_name=user["first_name"],
            last_name=user["last_name"],
            is_admin=user["is_admin"],
            display_name=f"{user['first_name'] or ''} {user['last_name'] or ''}".strip()
            or user["email"].split("@")[0],
        )


async def get_user_from_request(request: Request) -> Optional[dict]:
    """Extract user from JWT cookie."""
    token = request.cookies.get("access_token")
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        return None

    email = payload.get("sub")
    if not email:
        return None

    user = await User.select().where(User.email == email).first()
    return user


async def require_auth(request: Request) -> dict:
    """Dependency: require authenticated user."""
    user = await get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


async def require_admin(request: Request) -> dict:
    """Dependency: require admin user."""
    user = await require_auth(request)
    if not user["is_admin"]:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
