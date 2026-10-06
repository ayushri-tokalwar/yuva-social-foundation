from rest_framework import generics
from django.db.models import Q
from .models import CampaignCategory, Campaign
from .serializers import (
    CampaignCategorySerializer,
    CampaignListSerializer,
    CampaignDetailSerializer
)

class CampaignCategoryListAPIView(generics.ListAPIView):
    """
    List all campaign categories with campaign counts.
    """
    queryset = CampaignCategory.objects.all().order_by('name')
    serializer_class = CampaignCategorySerializer
    pagination_class = None


class CampaignListAPIView(generics.ListAPIView):
    """
    List campaigns with filtering by category, status, featured, or search query.
    """
    serializer_class = CampaignListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Campaign.objects.select_related('category').all()
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(Q(category__slug=category) | Q(category__name__iexact=category))
            
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        featured = self.request.query_params.get('featured')
        if featured in ['true', '1', 'True']:
            queryset = queryset.filter(is_featured=True)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )
            
        return queryset


class CampaignDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve single campaign details by slug or primary key.
    """
    serializer_class = CampaignDetailSerializer
    queryset = Campaign.objects.select_related('category').prefetch_related('updates').all()
    lookup_field = 'slug'

    def get_object(self):
        lookup = self.kwargs.get('slug')
        if lookup.isdigit():
            return generics.get_object_or_404(self.get_queryset(), pk=int(lookup))
        return generics.get_object_or_404(self.get_queryset(), slug=lookup)


class FeaturedCampaignsAPIView(generics.ListAPIView):
    """
    List featured campaigns for homepage preview.
    """
    serializer_class = CampaignListSerializer
    pagination_class = None

    def get_queryset(self):
        return Campaign.objects.select_related('category').filter(is_featured=True)[:4]
