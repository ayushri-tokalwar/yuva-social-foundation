from rest_framework import generics
from .models import Service
from .serializers import ServiceSerializer

class ServiceListAPIView(generics.ListAPIView):
    """
    List all active welfare services and initiatives.
    """
    serializer_class = ServiceSerializer
    queryset = Service.objects.filter(is_active=True).order_by('order', 'id')
    pagination_class = None


class ServiceDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve details for a specific welfare service by slug.
    """
    serializer_class = ServiceSerializer
    queryset = Service.objects.filter(is_active=True)
    lookup_field = 'slug'

    def get_object(self):
        lookup = self.kwargs.get('slug')
        if lookup.isdigit():
            return generics.get_object_or_404(self.get_queryset(), pk=int(lookup))
        return generics.get_object_or_404(self.get_queryset(), slug=lookup)
