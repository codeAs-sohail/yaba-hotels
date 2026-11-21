"""
Development settings for Yaba Fast Food project.

Enables debug mode, open CORS for local Vite development, and permissive hosts.
"""

from .base import *  # noqa: F401, F403

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True
