import re
from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)

    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['id', 'status', 'internal_notes', 'created_at', 'updated_at']

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-\(\)\+]', '', str(value))
        if len(cleaned) < 8 or len(cleaned) > 15:
            raise serializers.ValidationError("Please enter a valid contact phone number.")
        return value.strip()

    def validate_email(self, value):
        return value.lower().strip()

    def validate_message(self, value):
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError("Message must be at least 5 characters long.")
        return value.strip()

    def to_internal_value(self, data):
        normalized = data.copy() if hasattr(data, 'copy') else dict(data)
        
        # Support legacy / varied key casing
        if 'Name' in normalized and 'name' not in normalized:
            normalized['name'] = normalized['Name']
        if 'Contact' in normalized and 'phone' not in normalized:
            normalized['phone'] = normalized['Contact']
        if 'number' in normalized and 'phone' not in normalized:
            normalized['phone'] = normalized['number']
        if 'Email' in normalized and 'email' not in normalized:
            normalized['email'] = normalized['Email']
        if 'Address' in normalized and 'address' not in normalized:
            normalized['address'] = normalized['Address']
        if 'Message' in normalized and 'message' not in normalized:
            normalized['message'] = normalized['Message']
            
        return super().to_internal_value(normalized)
