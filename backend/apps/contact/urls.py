from django.urls import path
from .views import ContactMessageCreateAPIView, ContactMessageListAPIView

urlpatterns = [
    path('', ContactMessageCreateAPIView.as_view(), name='contact-create'),
    path('list/', ContactMessageListAPIView.as_view(), name='contact-list'),
]
