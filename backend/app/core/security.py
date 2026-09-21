"""Security utilities for hashing and JWT token handling."""

import os
import hashlib
import hmac
import base64
import json
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from backend.app.core.config import settings

# Try importing passlib / jose, fallback to robust standard library HMAC-SHA256
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    HAS_PASSLIB = True
except ImportError:
    HAS_PASSLIB = False

try:
    from jose import jwt, JWTError
    HAS_JOSE = True
except ImportError:
    HAS_JOSE = False


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    if HAS_PASSLIB:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    # Fallback to salt:sha256 format
    if ":" in hashed_password:
        salt, hash_val = hashed_password.split(":", 1)
        expected = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
        return hmac.compare_digest(hash_val, expected)
    return False


def get_password_hash(password: str) -> str:
    """Generate salted password hash."""
    if HAS_PASSLIB:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    # Fallback
    salt = os.urandom(16).hex()
    hash_val = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}:{hash_val}"


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    now = datetime.utcnow()
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now, "type": "access"})

    if HAS_JOSE:
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    # Pure standard library JWT fallback
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).rstrip(b'=').decode()
    
    # Convert datetime objects to int timestamps for JSON
    clean_data = {}
    for k, v in to_encode.items():
        if isinstance(v, datetime):
            clean_data[k] = int(v.timestamp())
        else:
            clean_data[k] = v
    payload_b64 = base64.urlsafe_b64encode(json.dumps(clean_data).encode()).rstrip(b'=').decode()
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        f"{header_b64}.{payload_b64}".encode(),
        hashlib.sha256
    ).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).rstrip(b'=').decode()
    return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token."""
    if HAS_JOSE:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except Exception:
            return None

    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode(),
            f"{header_b64}.{payload_b64}".encode(),
            hashlib.sha256
        ).digest()
        actual_sig = base64.urlsafe_b64decode(sig_b64 + "==")
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload_json = base64.urlsafe_b64decode(payload_b64 + "==").decode()
        payload = json.loads(payload_json)
        if "exp" in payload and payload["exp"] < time.time():
            return None
        return payload
    except Exception:
        return None
