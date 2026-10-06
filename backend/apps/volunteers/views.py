from rest_framework import generics, status
from rest_framework.response import Response
from .models import Volunteer
from .serializers import VolunteerSerializer

class VolunteerCreateAPIView(generics.CreateAPIView):
    """
    POST /api/volunteers/ - Submit a new volunteer application
    """
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        volunteer = serializer.save()
        
        return Response({
            "success": True,
            "message": "Thank you for registering as a volunteer with Yuva Social Foundation! Our team will contact you shortly.",
            "data": {
                "id": volunteer.id,
                "full_name": volunteer.full_name,
                "email": volunteer.email,
                "city": volunteer.city,
                "created_at": volunteer.created_at
            }
        }, status=status.HTTP_201_CREATED)


class VolunteerListAPIView(generics.ListAPIView):
    """
    GET /api/volunteers/ - List volunteer registrations
    """
    queryset = Volunteer.objects.all().order_by('-created_at')
    serializer_class = VolunteerSerializer
    pagination_class = None
