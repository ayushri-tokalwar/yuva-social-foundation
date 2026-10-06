from rest_framework import generics, status
from rest_framework.response import Response
from .models import DonationRequest
from .serializers import DonationRequestSerializer

class DonationRequestCreateAPIView(generics.CreateAPIView):
    """
    POST /api/donations/ - Submit a donation intent or support request
    """
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        donation = serializer.save()
        
        return Response({
            "success": True,
            "message": "Thank you for your generous intention to support Yuva Social Foundation! Your donation request has been recorded. Our coordinator will provide official bank details/receipt instructions.",
            "data": {
                "reference_id": donation.reference_id,
                "full_name": donation.full_name,
                "support_type": donation.get_support_type_display(),
                "intended_amount": str(donation.intended_amount) if donation.intended_amount else "In-Kind / Voluntary",
                "payment_preference": donation.get_payment_preference_display(),
                "created_at": donation.created_at
            }
        }, status=status.HTTP_201_CREATED)


class DonationRequestListAPIView(generics.ListAPIView):
    """
    GET /api/donations/ - List donation requests (admin/staff view)
    """
    queryset = DonationRequest.objects.all().order_by('-created_at')
    serializer_class = DonationRequestSerializer
    pagination_class = None
