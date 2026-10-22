import os
import csv
import uuid
from pathlib import Path
from PIL import Image

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q
from django.http import HttpResponse
from django.utils.text import slugify

from rest_framework import status, views, viewsets, generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from apps.volunteers.models import Volunteer
from apps.donations.models import DonationRequest
from apps.contact.models import ContactMessage
from apps.campaigns.models import Campaign, CampaignCategory, CampaignUpdate
from apps.gallery.models import GalleryItem, GalleryCategory
from apps.services.models import Service
from apps.foundation.models import FoundationProfile, TeamMember, Achievement, ImpactMetric

from .admin_serializers import (
    AdminVolunteerSerializer,
    AdminDonationSerializer,
    AdminContactMessageSerializer,
    AdminCampaignSerializer,
    AdminCampaignCategorySerializer,
    CampaignUpdateSerializer,
    AdminGalleryItemSerializer,
    AdminGalleryCategorySerializer,
    AdminServiceSerializer,
    AdminFoundationProfileSerializer,
    AdminTeamMemberSerializer,
    AdminImpactMetricSerializer,
    AdminAchievementSerializer,
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


def safe_delete_uploaded_file(image_path_or_url):
    """
    Removes the uploaded file if it resides in MEDIA_ROOT/uploads/
    and is not referenced by any other record.
    """
    if not image_path_or_url:
        return
    filename = str(image_path_or_url).replace('/media/', '').lstrip('/')
    if not filename.startswith('uploads/'):
        return

    # Check references
    g_count = GalleryItem.objects.filter(image__icontains=filename).count()
    c_count = Campaign.objects.filter(
        Q(featured_image__icontains=filename) | Q(banner_image__icontains=filename)
    ).count()
    s_count = Service.objects.filter(image__icontains=filename).count()
    t_count = TeamMember.objects.filter(photo__icontains=filename).count()
    a_count = Achievement.objects.filter(clipping_image__icontains=filename).count()

    # If count is <= 1 (meaning either only the record being deleted or 0), delete file
    if (g_count + c_count + s_count + t_count + a_count) <= 1:
        full_path = settings.MEDIA_ROOT / filename
        if full_path.exists() and full_path.is_file():
            try:
                full_path.unlink()
            except Exception:
                pass


# ==============================================================================
# AUTHENTICATION
# ==============================================================================

class AdminLoginView(views.APIView):
    """
    POST /api/admin/auth/login/
    Accepts: { username, password }
    Returns: { token, user }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username_or_email = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username_or_email or not password:
            return Response(
                {"detail": "Please provide both username/email and password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # First try direct authenticate
        user = authenticate(username=username_or_email, password=password)

        # If failed, attempt lookup by email
        if not user and '@' in username_or_email:
            try:
                matching_user = User.objects.get(email__iexact=username_or_email)
                user = authenticate(username=matching_user.username, password=password)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                pass

        if not user:
            return Response(
                {"detail": "Invalid credentials. Please verify your username and password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "This administrator account is disabled."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not (user.is_staff or user.is_superuser):
            return Response(
                {"detail": "Access denied. Only authorized staff/administrators can log in."},
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }
        })


class AdminLogoutView(views.APIView):
    """
    POST /api/admin/auth/logout/
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        try:
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()
        except Exception:
            pass
        return Response({"detail": "Successfully logged out."})


class AdminMeView(views.APIView):
    """
    GET /api/admin/auth/me/
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser
        })


# ==============================================================================
# DASHBOARD OVERVIEW & STATS
# ==============================================================================

class AdminDashboardStatsView(views.APIView):
    """
    GET /api/admin/dashboard/stats/
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        total_campaigns = Campaign.objects.count()
        active_campaigns = Campaign.objects.filter(status='active').count()

        total_volunteers = Volunteer.objects.count()
        pending_volunteers = Volunteer.objects.filter(status__in=['pending', 'under_review']).count()

        total_donations = DonationRequest.objects.count()
        pending_donations = DonationRequest.objects.filter(status__in=['pending', 'under_review']).count()

        total_messages = ContactMessage.objects.count()
        unread_messages = ContactMessage.objects.filter(status='unread').count()

        total_gallery = GalleryItem.objects.count()
        total_services = Service.objects.count()

        # Recent activities
        recent_volunteers = [
            {
                "id": v.id,
                "type": "volunteer",
                "title": f"Volunteer: {v.full_name}",
                "subtitle": f"{v.city}, {v.state} - {v.interests or 'General'}",
                "status": v.status,
                "created_at": v.created_at
            }
            for v in Volunteer.objects.order_by('-created_at')[:4]
        ]

        recent_donations = [
            {
                "id": d.id,
                "type": "donation",
                "title": f"Donation: {d.full_name} ({d.reference_id})",
                "subtitle": f"{d.get_support_type_display()} - {d.intended_amount or 'In-Kind'}",
                "status": d.status,
                "created_at": d.created_at
            }
            for d in DonationRequest.objects.order_by('-created_at')[:4]
        ]

        recent_messages = [
            {
                "id": m.id,
                "type": "message",
                "title": f"Message: {m.name}",
                "subtitle": f"{m.get_subject_display()}: {m.message[:60]}...",
                "status": m.status,
                "created_at": m.created_at
            }
            for m in ContactMessage.objects.order_by('-created_at')[:4]
        ]

        # Combine and sort recent activity
        combined_activity = sorted(
            recent_volunteers + recent_donations + recent_messages,
            key=lambda x: x['created_at'],
            reverse=True
        )[:8]

        return Response({
            "metrics": {
                "total_campaigns": total_campaigns,
                "active_campaigns": active_campaigns,
                "total_volunteers": total_volunteers,
                "pending_volunteers": pending_volunteers,
                "total_donations": total_donations,
                "pending_donations": pending_donations,
                "total_messages": total_messages,
                "unread_messages": unread_messages,
                "total_gallery": total_gallery,
                "total_services": total_services,
            },
            "recent_activity": combined_activity
        })


# ==============================================================================
# VOLUNTEERS MANAGEMENT
# ==============================================================================

class AdminVolunteerListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminVolunteerSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = Volunteer.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(city__icontains=search) |
                Q(skills__icontains=search) |
                Q(interests__icontains=search)
            )
        status_filter = self.request.query_params.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            qs = qs.filter(status=status_filter)
        return qs


class AdminVolunteerDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminVolunteerSerializer
    queryset = Volunteer.objects.all()


class AdminVolunteerExportCSVView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="ysf_volunteers.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'ID', 'First Name', 'Last Name', 'Email', 'Phone',
            'City', 'State', 'Interests', 'Skills', 'Availability',
            'Status', 'Submission Date', 'Notes'
        ])

        volunteers = Volunteer.objects.all().order_by('-created_at')
        for v in volunteers:
            writer.writerow([
                v.id, v.first_name, v.last_name, v.email, v.phone,
                v.city, v.state, v.interests, v.skills, v.availability,
                v.status, v.created_at.strftime('%Y-%m-%d %H:%M:%S'), v.internal_notes
            ])

        return response


# ==============================================================================
# DONATION / SUPPORT REQUEST MANAGEMENT
# ==============================================================================

class AdminDonationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminDonationSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = DonationRequest.objects.select_related('campaign').all().order_by('-created_at')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(reference_id__icontains=search) |
                Q(full_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(city__icontains=search)
            )
        status_filter = self.request.query_params.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            qs = qs.filter(status=status_filter)
        support_type = self.request.query_params.get('support_type', '').strip()
        if support_type and support_type.lower() != 'all':
            qs = qs.filter(support_type=support_type)
        return qs


class AdminDonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminDonationSerializer
    queryset = DonationRequest.objects.select_related('campaign').all()


class AdminDonationExportCSVView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="ysf_donation_requests.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Reference ID', 'Full Name', 'Email', 'Phone', 'City', 'State',
            'Support Type', 'Campaign', 'Intended Amount', 'Payment Preference',
            'PAN Number', 'Status', 'Submission Date', 'Notes'
        ])

        donations = DonationRequest.objects.select_related('campaign').all().order_by('-created_at')
        for d in donations:
            writer.writerow([
                d.reference_id, d.full_name, d.email, d.phone, d.city, d.state,
                d.get_support_type_display(), d.campaign.title if d.campaign else 'General Foundation',
                d.intended_amount or 'In-Kind', d.get_payment_preference_display(),
                d.pan_number, d.status, d.created_at.strftime('%Y-%m-%d %H:%M:%S'), d.notes
            ])

        return response


# ==============================================================================
# CONTACT MESSAGE MANAGEMENT
# ==============================================================================

class AdminContactMessageListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminContactMessageSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = ContactMessage.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(message__icontains=search) |
                Q(address__icontains=search)
            )
        status_filter = self.request.query_params.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            qs = qs.filter(status=status_filter)
        return qs


class AdminContactMessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminContactMessageSerializer
    queryset = ContactMessage.objects.all()


# ==============================================================================
# CAMPAIGN MANAGEMENT
# ==============================================================================

class AdminCampaignCategoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminCampaignCategorySerializer
    queryset = CampaignCategory.objects.all().order_by('name')


class AdminCampaignListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminCampaignSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = Campaign.objects.select_related('category').prefetch_related('updates').all().order_by('-is_featured', 'order', '-created_at')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )
        category = self.request.query_params.get('category', '').strip()
        if category and category.lower() != 'all':
            qs = qs.filter(Q(category__slug=category) | Q(category__id=category) if category.isdigit() else Q(category__slug=category))
        status_filter = self.request.query_params.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            qs = qs.filter(status=status_filter)
        return qs


class AdminCampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminCampaignSerializer
    queryset = Campaign.objects.select_related('category').prefetch_related('updates').all()

    def perform_destroy(self, instance):
        safe_delete_uploaded_file(instance.featured_image)
        safe_delete_uploaded_file(instance.banner_image)
        instance.delete()


class AdminCampaignUpdateCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = CampaignUpdateSerializer
    queryset = CampaignUpdate.objects.all()


class AdminCampaignUpdateDetailView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = CampaignUpdateSerializer
    queryset = CampaignUpdate.objects.all()


# ==============================================================================
# GALLERY & IMAGE MANAGEMENT
# ==============================================================================

class AdminGalleryCategoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminGalleryCategorySerializer
    queryset = GalleryCategory.objects.all().order_by('name')


class AdminGalleryItemListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminGalleryItemSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = GalleryItem.objects.select_related('category').all().order_by('-is_featured', 'order', '-id')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(caption__icontains=search) |
                Q(location__icontains=search)
            )
        category = self.request.query_params.get('category', '').strip()
        if category and category.lower() != 'all':
            qs = qs.filter(category__id=category) if category.isdigit() else qs.filter(category__slug=category)
        return qs


class AdminGalleryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminGalleryItemSerializer
    queryset = GalleryItem.objects.select_related('category').all()

    def perform_destroy(self, instance):
        safe_delete_uploaded_file(instance.image)
        instance.delete()


class AdminImageUploadView(views.APIView):
    """
    POST /api/admin/upload-image/
    Supports: multipart/form-data with file field 'image'
    Validates: JPG, PNG, WEBP, max 15MB
    Saves to: MEDIA_ROOT / 'uploads'
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('image')
        if not uploaded_file:
            return Response(
                {"detail": "No image file provided in upload request."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Size validation (max 15 MB)
        if uploaded_file.size > 15 * 1024 * 1024:
            return Response(
                {"detail": "Image file size exceeds the 15MB limit."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Content validation using Pillow
        try:
            img = Image.open(uploaded_file)
            img_format = img.format.upper()
            if img_format not in ['JPEG', 'PNG', 'WEBP']:
                return Response(
                    {"detail": f"Unsupported image format: {img_format}. Allowed formats: JPG/JPEG, PNG, WebP."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            width, height = img.size
        except Exception as e:
            return Response(
                {"detail": f"Corrupt or invalid image file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Create destination directory
        uploads_dir = settings.MEDIA_ROOT / 'uploads'
        uploads_dir.mkdir(parents=True, exist_ok=True)

        # 4. Generate unique, safe filename
        ext = 'jpg' if img_format == 'JPEG' else img_format.lower()
        base_name = slugify(Path(uploaded_file.name).stem)[:40] or 'upload'
        unique_suffix = uuid.uuid4().hex[:8]
        final_filename = f"{base_name}-{unique_suffix}.{ext}"
        final_path = uploads_dir / final_filename

        # 5. Save file
        try:
            uploaded_file.seek(0)
            with open(final_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
        except Exception as e:
            return Response(
                {"detail": f"Failed to save image to storage: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        relative_media_path = f"/media/uploads/{final_filename}"

        return Response({
            "success": True,
            "url": relative_media_path,
            "filename": f"uploads/{final_filename}",
            "size": uploaded_file.size,
            "width": width,
            "height": height,
            "format": img_format
        }, status=status.HTTP_201_CREATED)


# ==============================================================================
# SERVICES MANAGEMENT
# ==============================================================================

class AdminServiceListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminServiceSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = Service.objects.all().order_by('order', 'id')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(short_description__icontains=search) |
                Q(detailed_description__icontains=search)
            )
        return qs


class AdminServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminServiceSerializer
    queryset = Service.objects.all()

    def perform_destroy(self, instance):
        safe_delete_uploaded_file(instance.image)
        instance.delete()


# ==============================================================================
# FOUNDATION SETTINGS & CONTENT
# ==============================================================================

class AdminFoundationProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        profile = FoundationProfile.objects.first()
        if not profile:
            profile = FoundationProfile.objects.create(name="Yuva Social Foundation")
        serializer = AdminFoundationProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = FoundationProfile.objects.first()
        if not profile:
            profile = FoundationProfile.objects.create(name="Yuva Social Foundation")
        serializer = AdminFoundationProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminTeamMemberListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminTeamMemberSerializer
    queryset = TeamMember.objects.all().order_by('order', 'id')


class AdminTeamMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminTeamMemberSerializer
    queryset = TeamMember.objects.all()

    def perform_destroy(self, instance):
        safe_delete_uploaded_file(instance.photo)
        instance.delete()


class AdminImpactMetricListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminImpactMetricSerializer
    queryset = ImpactMetric.objects.all().order_by('order', 'id')


class AdminImpactMetricDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminImpactMetricSerializer
    queryset = ImpactMetric.objects.all()


class AdminAchievementListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminAchievementSerializer
    queryset = Achievement.objects.all().order_by('order', '-id')


class AdminAchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminAchievementSerializer
    queryset = Achievement.objects.all()

    def perform_destroy(self, instance):
        safe_delete_uploaded_file(instance.clipping_image)
        instance.delete()
