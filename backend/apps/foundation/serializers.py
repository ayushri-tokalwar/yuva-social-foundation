from rest_framework import serializers
from .models import FoundationProfile, TeamMember, Achievement, ImpactMetric

class FoundationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundationProfile
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'


class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = '__all__'


class FoundationOverviewSerializer(serializers.Serializer):
    profile = FoundationProfileSerializer()
    leaders = TeamMemberSerializer(many=True)
    metrics = ImpactMetricSerializer(many=True)
    achievements = AchievementSerializer(many=True)
