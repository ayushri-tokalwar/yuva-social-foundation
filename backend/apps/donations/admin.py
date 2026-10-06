from django.contrib import admin
from .models import DonationRequest

@admin.register(DonationRequest)
class DonationRequestAdmin(admin.ModelAdmin):
    list_display = ('reference_id', 'full_name', 'phone', 'support_type', 'intended_amount', 'status', 'created_at')
    list_filter = ('support_type', 'status', 'payment_preference', 'created_at')
    list_editable = ('status',)
    search_fields = ('reference_id', 'full_name', 'email', 'phone', 'city')
    readonly_fields = ('reference_id', 'created_at', 'updated_at')
