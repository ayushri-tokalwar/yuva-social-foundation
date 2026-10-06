from rest_framework import serializers
from .models import GalleryCategory, GalleryItem

class GalleryCategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = GalleryCategory
        fields = ['id', 'name', 'slug', 'description', 'item_count']

    def get_item_count(self, obj):
        return obj.items.count()


class GalleryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = GalleryItem
        fields = [
            'id', 'title', 'category', 'category_name', 'category_slug',
            'image', 'caption', 'location', 'event_date', 'is_featured',
            'order', 'created_at'
        ]
