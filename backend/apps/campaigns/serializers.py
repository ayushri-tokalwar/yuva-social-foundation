from rest_framework import serializers
from .models import CampaignCategory, Campaign, CampaignUpdate

class CampaignCategorySerializer(serializers.ModelSerializer):
    campaign_count = serializers.SerializerMethodField()

    class Meta:
        model = CampaignCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'campaign_count']

    def get_campaign_count(self, obj):
        return obj.campaigns.count()


class CampaignUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignUpdate
        fields = '__all__'


class CampaignListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'subtitle', 'description', 'location', 'start_date', 'end_date',
            'featured_image', 'target_beneficiaries', 'beneficiaries_helped',
            'goal_amount', 'raised_amount', 'status', 'is_featured', 'order',
            'created_at'
        ]


class CampaignDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    updates = CampaignUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = '__all__'
