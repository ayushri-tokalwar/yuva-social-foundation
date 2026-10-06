import re
from rest_framework import serializers
from .models import Volunteer

class VolunteerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['id', 'status', 'internal_notes', 'created_at', 'updated_at']

    def validate_first_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters long.")
        return value.strip()

    def validate_last_name(self, value):
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("Last name is required.")
        return value.strip()

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-\(\)\+]', '', str(value))
        if len(cleaned) < 8 or len(cleaned) > 15:
            raise serializers.ValidationError("Please enter a valid 10-digit mobile number.")
        return value.strip()

    def validate_email(self, value):
        return value.lower().strip()

    def to_internal_value(self, data):
        # Support legacy / varied key casing gracefully
        normalized_data = data.copy() if hasattr(data, 'copy') else dict(data)
        
        if 'FirstName' in normalized_data and 'first_name' not in normalized_data:
            normalized_data['first_name'] = normalized_data['FirstName']
        if 'LastName' in normalized_data and 'last_name' not in normalized_data:
            normalized_data['last_name'] = normalized_data['LastName']
        if 'Email' in normalized_data and 'email' not in normalized_data:
            normalized_data['email'] = normalized_data['Email']
        if 'MobileNumber' in normalized_data and 'phone' not in normalized_data:
            normalized_data['phone'] = normalized_data['MobileNumber']
        if 'Number' in normalized_data and 'phone' not in normalized_data:
            normalized_data['phone'] = normalized_data['Number']
        if 'Address_Colony' in normalized_data and 'address_line1' not in normalized_data:
            normalized_data['address_line1'] = normalized_data['Address_Colony']
        if 'Address_Apartment' in normalized_data and 'address_line2' not in normalized_data:
            normalized_data['address_line2'] = normalized_data['Address_Apartment']
        if 'City' in normalized_data and 'city' not in normalized_data:
            normalized_data['city'] = normalized_data['City']
        if 'State' in normalized_data and 'state' not in normalized_data:
            normalized_data['state'] = normalized_data['State']
            
        return super().to_internal_value(normalized_data)
