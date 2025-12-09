"""Authentication utilities - JWT, password hashing, and rate limiting"""

import os
from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import Optional

import bcrypt
from jose import JWTError, jwt

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-please")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# Rate limiting storage (in-memory, use Redis in production)
_login_attempts: dict[str, list[datetime]] = defaultdict(list)

# Rate limit settings
MAX_LOGIN_ATTEMPTS = 5
LOGIN_WINDOW_MINUTES = 15
LOCKOUT_MINUTES = 30


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(UTC) + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# === Rate Limiting ===

def _cleanup_old_attempts(ip: str) -> None:
    """Remove attempts older than the window."""
    cutoff = datetime.now(UTC) - timedelta(minutes=LOGIN_WINDOW_MINUTES)
    _login_attempts[ip] = [t for t in _login_attempts[ip] if t > cutoff]


def check_rate_limit(ip: str) -> tuple[bool, int]:
    """Check if IP is rate limited. Returns (is_blocked, remaining_seconds)."""
    _cleanup_old_attempts(ip)
    attempts = _login_attempts[ip]

    if len(attempts) >= MAX_LOGIN_ATTEMPTS:
        oldest = min(attempts)
        lockout_end = oldest + timedelta(minutes=LOCKOUT_MINUTES)
        remaining = (lockout_end - datetime.now(UTC)).total_seconds()
        if remaining > 0:
            return True, int(remaining)
        # Lockout expired, clear attempts
        _login_attempts[ip] = []

    return False, 0


def record_login_attempt(ip: str) -> None:
    """Record a failed login attempt."""
    _cleanup_old_attempts(ip)
    _login_attempts[ip].append(datetime.now(UTC))


def clear_login_attempts(ip: str) -> None:
    """Clear attempts after successful login."""
    _login_attempts[ip] = []
