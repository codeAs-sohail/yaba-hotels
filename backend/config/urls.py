import time
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.db import connection


def health_check(request):
    """
    GET /health/
    Single unified health-check & keep-alive endpoint for UptimeRobot.
    Executes a real SQL query (SELECT 1) on the database so that
    both the Render Web Server and Supabase PostgreSQL Database stay 24/7 active.
    """
    start_time = time.time()
    try:
        # Real database query to prevent database idle pause / sleep
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            cursor.fetchone()

        latency_ms = round((time.time() - start_time) * 1000, 2)
        return JsonResponse({
            "status": "healthy",
            "server": "online",
            "database": "active",
            "db_latency_ms": latency_ms,
            "message": "Both Server and Supabase Database are active."
        }, status=200)

    except Exception as e:
        return JsonResponse({
            "status": "unhealthy",
            "server": "online",
            "database": "disconnected",
            "error": str(e),
            "message": "Server is up, but database query failed."
        }, status=503)


urlpatterns = [
    # Single Health Check endpoint for UptimeRobot (available at /health/ and /)
    path('health/', health_check, name='health-check'),
    path('', health_check, name='health-check-root'),

    # Django Admin & REST APIs
    path('admin/', admin.site.urls),
    path('api/', include('apps.Hotels.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
