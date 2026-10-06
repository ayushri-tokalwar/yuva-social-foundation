from django.contrib import admin
from .models import Volunteer

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone', 'email', 'city', 'state', 'status', 'created_at')
    list_filter = ('status', 'city', 'state', 'created_at')
    list_editable = ('status',)
    search_fields = ('first_name', 'last_name', 'email', 'phone', 'city', 'skills', 'interests')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state')
        }),
        ('Engagement & Preferences', {
            'fields': ('interests', 'skills', 'availability', 'message')
        }),
        ('Administration & Status', {
            'fields': ('status', 'internal_notes', 'created_at', 'updated_at')
        }),
    )
