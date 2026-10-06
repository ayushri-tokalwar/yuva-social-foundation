from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'is_highlighted', 'is_active', 'order', 'created_at')
    list_editable = ('is_highlighted', 'is_active', 'order')
    search_fields = ('title', 'short_description')
    prepopulated_fields = {'slug': ('title',)}
