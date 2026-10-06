from django.urls import path
from .views import VolunteerCreateAPIView, VolunteerListAPIView

urlpatterns = [
    path('', VolunteerCreateAPIView.as_view(), name='volunteer-create'),
    path('list/', VolunteerListAPIView.as_view(), name='volunteer-list'),
]
