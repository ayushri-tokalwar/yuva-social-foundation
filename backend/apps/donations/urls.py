from django.urls import path
from .views import DonationRequestCreateAPIView, DonationRequestListAPIView

urlpatterns = [
    path('', DonationRequestCreateAPIView.as_view(), name='donation-create'),
    path('list/', DonationRequestListAPIView.as_view(), name='donation-list'),
]
