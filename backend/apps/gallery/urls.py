from django.urls import path
from .views import GalleryCategoryListAPIView, GalleryItemListAPIView

urlpatterns = [
    path('categories/', GalleryCategoryListAPIView.as_view(), name='gallery-categories'),
    path('', GalleryItemListAPIView.as_view(), name='gallery-items'),
]
