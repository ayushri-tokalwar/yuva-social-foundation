from django.contrib import admin
from .models import FoundationProfile, TeamMember, Achievement, ImpactMetric

@admin.register(FoundationProfile)
class FoundationProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'established_year', 'registered_year', 'official_email', 'official_phone', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'phone', 'is_leader', 'order', 'is_active')
    list_editable = ('order', 'is_leader', 'is_active')
    search_fields = ('name', 'role', 'phone')
    list_filter = ('is_leader', 'is_active')

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'publication_name', 'date', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'publication_name', 'description')

@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'icon', 'order', 'is_active')
    list_editable = ('value', 'order', 'is_active')
    search_fields = ('label',)
