from django.urls import path
from .views import ServiceListAPIView, ServiceDetailAPIView

urlpatterns = [
    path('', ServiceListAPIView.as_view(), name='service-list'),
    path('<str:slug>/', ServiceDetailAPIView.as_view(), name='service-detail'),
]
