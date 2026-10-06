import re
from rest_framework import serializers
from .models import DonationRequest
from apps.campaigns.models import Campaign

class DonationRequestSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)

    class Meta:
        model = DonationRequest
        fields = '__all__'
        read_only_fields = ['id', 'reference_id', 'status', 'notes', 'created_at', 'updated_at']

    def validate_full_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long.")
        return value.strip()

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-\(\)\+]', '', str(value))
        if len(cleaned) < 8 or len(cleaned) > 15:
            raise serializers.ValidationError("Please provide a valid contact number.")
        return value.strip()

    def validate_email(self, value):
        return value.lower().strip()

    def to_internal_value(self, data):
        normalized = data.copy() if hasattr(data, 'copy') else dict(data)
        
        # Support aliases
        if 'name' in normalized and 'full_name' not in normalized:
            normalized['full_name'] = normalized['name']
        if 'Name' in normalized and 'full_name' not in normalized:
            normalized['full_name'] = normalized['Name']
        if 'amount' in normalized and 'intended_amount' not in normalized:
            normalized['intended_amount'] = normalized['amount']
        if 'campaign_id' in normalized and 'campaign' not in normalized:
            normalized['campaign'] = normalized['campaign_id']
            
        return super().to_internal_value(normalized)
