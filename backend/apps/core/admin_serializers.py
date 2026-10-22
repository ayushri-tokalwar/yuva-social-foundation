from rest_framework import serializers
from apps.volunteers.models import Volunteer
from apps.donations.models import DonationRequest
from apps.contact.models import ContactMessage
from apps.campaigns.models import Campaign, CampaignCategory, CampaignUpdate
from apps.gallery.models import GalleryItem, GalleryCategory
from apps.services.models import Service
from apps.foundation.models import FoundationProfile, TeamMember, Achievement, ImpactMetric


class AdminVolunteerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminDonationSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    support_type_display = serializers.CharField(source='get_support_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_preference_display = serializers.CharField(source='get_payment_preference_display', read_only=True)

    class Meta:
        model = DonationRequest
        fields = '__all__'
        read_only_fields = ['id', 'reference_id', 'created_at', 'updated_at']


class AdminContactMessageSerializer(serializers.ModelSerializer):
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class CampaignUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignUpdate
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class AdminCampaignCategorySerializer(serializers.ModelSerializer):
    campaign_count = serializers.SerializerMethodField()

    class Meta:
        model = CampaignCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'campaign_count']

    def get_campaign_count(self, obj):
        return obj.campaigns.count()


class AdminCampaignSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    updates = CampaignUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminGalleryCategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = GalleryCategory
        fields = ['id', 'name', 'slug', 'description', 'item_count']

    def get_item_count(self, obj):
        return obj.items.count()


class AdminGalleryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = GalleryItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class AdminServiceSerializer(serializers.ModelSerializer):
    key_points_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def get_key_points_list(self, obj):
        if not obj.key_points:
            return []
        return [point.strip() for point in obj.key_points.split('\n') if point.strip()]


class AdminFoundationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundationProfile
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminTeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class AdminImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = '__all__'


class AdminAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
