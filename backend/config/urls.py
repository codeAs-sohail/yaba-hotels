import time
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connection


def ping_database():
    """
    Executes a lightweight query on the database to verify connectivity
    and keep the connection / database server awake (prevent idle sleep).
    """
    start = time.time()
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        cursor.fetchone()
    latency_ms = round((time.time() - start) * 1000, 2)
    return latency_ms


def health_check(request):
    """
    GET /health/ or /api/health/
    Health check endpoint that actively queries the database
    to keep PostgreSQL/Supabase/Render DB active and prevent idle sleep.
    """
    try:
        latency_ms = ping_database()
        return JsonResponse({
            "status": "healthy",
            "database": "connected",
            "db_latency_ms": latency_ms,
            "service": "Yaba Fast Food REST API",
            "message": "Backend and database are active and operational."
        }, status=200)
    except Exception as e:
        return JsonResponse({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "service": "Yaba Fast Food REST API",
        }, status=503)


def api_root(request):
    """
    Root health check and welcome endpoint.
    Also executes a DB ping to keep the database awake when pinged at base URL.
    """
    try:
        latency_ms = ping_database()
        db_status = "connected"
    except Exception as e:
        latency_ms = None
        db_status = f"disconnected: {str(e)}"

    return JsonResponse({
        "status": "online",
        "service": "Yaba Fast Food REST API",
        "database": db_status,
        "db_latency_ms": latency_ms,
        "message": "Backend is running successfully.",
        "endpoints": {
            "health": "/health/",
            "api_health": "/api/health/",
            "branches": "/api/branches/",
            "menu": "/api/menu/",
            "categories": "/api/categories/",
            "gallery": "/api/gallery/",
            "feedback": "/api/feedback/",
            "admin": "/admin/",
        }
    })


urlpatterns = [
    path('', api_root, name='api-root-health'),
    path('health/', health_check, name='health-check'),
    path('api/health/', health_check, name='api-health-check'),
    path('admin/', admin.site.urls),
    path('api/', include('apps.Hotels.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

