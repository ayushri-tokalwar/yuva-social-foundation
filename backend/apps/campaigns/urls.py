from django.urls import path
from .views import (
    CampaignCategoryListAPIView,
    CampaignListAPIView,
    CampaignDetailAPIView,
    FeaturedCampaignsAPIView
)

urlpatterns = [
    path('categories/', CampaignCategoryListAPIView.as_view(), name='campaign-categories'),
    path('featured/', FeaturedCampaignsAPIView.as_view(), name='campaigns-featured'),
    path('', CampaignListAPIView.as_view(), name='campaign-list'),
    path('<str:slug>/', CampaignDetailAPIView.as_view(), name='campaign-detail'),
]
