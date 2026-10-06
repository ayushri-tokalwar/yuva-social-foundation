from django.urls import path
from .views import (
    FoundationProfileView,
    TeamMemberListAPIView,
    AchievementListAPIView,
    ImpactMetricListAPIView,
    FoundationOverviewAPIView
)

urlpatterns = [
    path('profile/', FoundationProfileView.as_view(), name='foundation-profile'),
    path('team/', TeamMemberListAPIView.as_view(), name='foundation-team'),
    path('achievements/', AchievementListAPIView.as_view(), name='foundation-achievements'),
    path('metrics/', ImpactMetricListAPIView.as_view(), name='foundation-metrics'),
    path('overview/', FoundationOverviewAPIView.as_view(), name='foundation-overview'),
]
