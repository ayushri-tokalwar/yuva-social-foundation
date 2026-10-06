from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    key_points_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'

    def get_key_points_list(self, obj):
        if not obj.key_points:
            return []
        return [point.strip() for point in obj.key_points.split('\n') if point.strip()]
