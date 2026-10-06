from rest_framework import generics
from django.db.models import Q
from .models import GalleryCategory, GalleryItem
from .serializers import GalleryCategorySerializer, GalleryItemSerializer

class GalleryCategoryListAPIView(generics.ListAPIView):
    """
    List all gallery categories.
    """
    queryset = GalleryCategory.objects.all().order_by('name')
    serializer_class = GalleryCategorySerializer
    pagination_class = None


class GalleryItemListAPIView(generics.ListAPIView):
    """
    List gallery items with optional category filtering or search.
    """
    serializer_class = GalleryItemSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = GalleryItem.objects.select_related('category').all()
        
        category = self.request.query_params.get('category')
        if category and category.lower() != 'all':
            queryset = queryset.filter(
                Q(category__slug=category) | Q(category__name__iexact=category)
            )
            
        featured = self.request.query_params.get('featured')
        if featured in ['true', '1', 'True']:
            queryset = queryset.filter(is_featured=True)
            
        return queryset
