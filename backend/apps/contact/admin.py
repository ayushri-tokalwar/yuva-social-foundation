from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'phone', 'email', 'status', 'created_at')
    list_filter = ('subject', 'status', 'created_at')
    list_editable = ('status',)
    search_fields = ('name', 'email', 'phone', 'address', 'message')
    readonly_fields = ('created_at', 'updated_at')
