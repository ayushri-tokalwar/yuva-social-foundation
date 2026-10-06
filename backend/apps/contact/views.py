from rest_framework import generics, status
from rest_framework.response import Response
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactMessageCreateAPIView(generics.CreateAPIView):
    """
    POST /api/contact/ - Submit a message / inquiry to Yuva Social Foundation
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        msg = serializer.save()
        
        return Response({
            "success": True,
            "message": "Thank you for reaching out to Yuva Social Foundation! Your message has been received. Our team will get back to you shortly.",
            "data": {
                "id": msg.id,
                "name": msg.name,
                "email": msg.email,
                "subject": msg.get_subject_display(),
                "created_at": msg.created_at
            }
        }, status=status.HTTP_201_CREATED)


class ContactMessageListAPIView(generics.ListAPIView):
    """
    GET /api/contact/ - List contact inquiries (admin/staff)
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    pagination_class = None
