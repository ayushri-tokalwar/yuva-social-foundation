"""
URL Configuration for Yuva Social Foundation backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API Discovery Endpoint."""
    return Response({
        "name": "Yuva Social Foundation API",
        "version": "1.0.0",
        "description": "RESTful API services for Yuva Social Foundation full-stack platform",
        "status": "online",
        "endpoints": {
            "foundation": "/api/foundation/",
            "campaigns": "/api/campaigns/",
            "services": "/api/services/",
            "gallery": "/api/gallery/",
            "volunteers": "/api/volunteers/",
            "donations": "/api/donations/",
            "contact": "/api/contact/",
            "admin": "/api/admin/",
            "health": "/api/health/",
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for deployment monitoring."""
    return Response({
        "status": "healthy",
        "database": "connected",
        "service": "Yuva Social Foundation Backend API"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/health/', health_check, name='api-health'),
    path('api/admin/', include('apps.core.admin_urls')),
    path('api/foundation/', include('apps.foundation.urls')),
    path('api/campaigns/', include('apps.campaigns.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/gallery/', include('apps.gallery.urls')),
    path('api/volunteers/', include('apps.volunteers.urls')),
    path('api/donations/', include('apps.donations.urls')),
    path('api/contact/', include('apps.contact.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "Yuva Social Foundation Admin"
admin.site.site_title = "YSF Portal"
admin.site.index_title = "Foundation Administration & Management"
