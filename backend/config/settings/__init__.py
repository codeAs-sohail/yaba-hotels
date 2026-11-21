"""
Settings initialization dispatcher.
Loads production settings if DJANGO_ENV is 'production', otherwise defaults to development.
"""

import os

env = os.getenv("DJANGO_ENV", "development").lower()

if env == "production":
    from .production import *  # noqa: F401, F403
else:
    from .development import *  # noqa: F401, F403
