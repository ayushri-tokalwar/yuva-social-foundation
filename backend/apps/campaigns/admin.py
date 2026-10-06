from django.contrib import admin
from .models import CampaignCategory, Campaign, CampaignUpdate

@admin.register(CampaignCategory)
class CampaignCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

class CampaignUpdateInline(admin.TabularInline):
    model = CampaignUpdate
    extra = 1

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'is_featured', 'order', 'location', 'start_date')
    list_filter = ('status', 'is_featured', 'category')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('status', 'is_featured', 'order')
    inlines = [CampaignUpdateInline]
