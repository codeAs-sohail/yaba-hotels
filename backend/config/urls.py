from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    """
    Root health check and welcome endpoint.
    Prevents 404 when visiting the base URL on Render.
    """
    return JsonResponse({
        "status": "online",
        "service": "Yaba Fast Food REST API",
        "message": "Backend is running successfully.",
        "endpoints": {
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
    path('admin/', admin.site.urls),
    path('api/', include('apps.Hotels.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
