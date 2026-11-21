"""
Production settings for Yaba Fast Food project.

Enforces production security controls, secure cookies, HTTPS redirect,
HSTS headers, and environment-based configuration.
"""

import os
from django.core.exceptions import ImproperlyConfigured
from .base import *  # noqa: F401, F403

# DEBUG must strictly be False in production
DEBUG = False

# Enforce secure SECRET_KEY in production
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
if not SECRET_KEY or SECRET_KEY.startswith("django-insecure-"):
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY environment variable must be set to a secure, random value in production."
    )

# Production ALLOWED_HOSTS must be explicitly defined
hosts = os.getenv("DJANGO_ALLOWED_HOSTS", "")
if not hosts:
    raise ImproperlyConfigured(
        "DJANGO_ALLOWED_HOSTS environment variable must be configured in production (e.g. 'yabafastfood.com,api.yabafastfood.com')."
    )
ALLOWED_HOSTS = [h.strip() for h in hosts.split(",") if h.strip()]


# HTTPS & SSL Security Headers
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "True").lower() in ("true", "1", "t")
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "True").lower() in ("true", "1", "t")
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE", "True").lower() in ("true", "1", "t")
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

# HTTP Strict Transport Security (HSTS)
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Forwarded protocol header for reverse proxies (Render, Railway, Fly.io, AWS ALB, Nginx)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# Production Mailers Configuration (Django 6.1)
MAILERS = {
    "default": {
        "BACKEND": os.getenv(
            "DJANGO_EMAIL_BACKEND",
            "django.core.mail.backends.smtp.EmailBackend"
        ),
        "OPTIONS": {
            "host": os.getenv("EMAIL_HOST", "localhost"),
            "port": int(os.getenv("EMAIL_PORT", 587)),
            "use_tls": os.getenv("EMAIL_USE_TLS", "True").lower() in ("true", "1", "t"),
            "username": os.getenv("EMAIL_HOST_USER", ""),
            "password": os.getenv("EMAIL_HOST_PASSWORD", ""),
        },
    },
}

# Production CORS
CORS_ALLOW_ALL_ORIGINS = False
cors_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "")
if cors_origins_env:
    CORS_ALLOWED_ORIGINS = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]
