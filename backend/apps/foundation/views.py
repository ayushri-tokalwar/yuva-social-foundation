from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import FoundationProfile, TeamMember, Achievement, ImpactMetric
from .serializers import (
    FoundationProfileSerializer,
    TeamMemberSerializer,
    AchievementSerializer,
    ImpactMetricSerializer
)

class FoundationProfileView(APIView):
    """
    Returns the core foundation profile data.
    """
    def get(self, request):
        profile = FoundationProfile.objects.first()
        if not profile:
            return Response(
                {"detail": "Foundation profile not initialized yet."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = FoundationProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)


class TeamMemberListAPIView(generics.ListAPIView):
    """
    List all active team members ordered by rank/order.
    """
    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.filter(is_active=True).order_by('order', 'id')
    pagination_class = None  # Return all team members for easy display


class AchievementListAPIView(generics.ListAPIView):
    """
    List all achievements and media news recognitions.
    """
    serializer_class = AchievementSerializer
    queryset = Achievement.objects.all().order_by('order', '-id')
    pagination_class = None


class ImpactMetricListAPIView(generics.ListAPIView):
    """
    List active impact metrics and qualitative statistics.
    """
    serializer_class = ImpactMetricSerializer
    queryset = ImpactMetric.objects.filter(is_active=True).order_by('order', 'id')
    pagination_class = None


class FoundationOverviewAPIView(APIView):
    """
    Consolidated endpoint for homepage & about page fast loading.
    """
    def get(self, request):
        profile = FoundationProfile.objects.first()
        team = TeamMember.objects.filter(is_active=True).order_by('order', 'id')
        achievements = Achievement.objects.all().order_by('order', '-id')[:6]
        metrics = ImpactMetric.objects.filter(is_active=True).order_by('order', 'id')

        return Response({
            "profile": FoundationProfileSerializer(profile, context={'request': request}).data if profile else None,
            "team": TeamMemberSerializer(team, many=True, context={'request': request}).data,
            "achievements": AchievementSerializer(achievements, many=True, context={'request': request}).data,
            "metrics": ImpactMetricSerializer(metrics, many=True).data,
        })
