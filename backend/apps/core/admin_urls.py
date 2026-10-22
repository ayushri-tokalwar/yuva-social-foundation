from django.urls import path
from .admin_views import (
    AdminLoginView,
    AdminLogoutView,
    AdminMeView,
    AdminDashboardStatsView,
    AdminVolunteerListView,
    AdminVolunteerDetailView,
    AdminVolunteerExportCSVView,
    AdminDonationListView,
    AdminDonationDetailView,
    AdminDonationExportCSVView,
    AdminContactMessageListView,
    AdminContactMessageDetailView,
    AdminCampaignCategoryListCreateView,
    AdminCampaignListCreateView,
    AdminCampaignDetailView,
    AdminCampaignUpdateCreateView,
    AdminCampaignUpdateDetailView,
    AdminGalleryCategoryListCreateView,
    AdminGalleryItemListCreateView,
    AdminGalleryItemDetailView,
    AdminImageUploadView,
    AdminServiceListCreateView,
    AdminServiceDetailView,
    AdminFoundationProfileView,
    AdminTeamMemberListCreateView,
    AdminTeamMemberDetailView,
    AdminImpactMetricListCreateView,
    AdminImpactMetricDetailView,
    AdminAchievementListCreateView,
    AdminAchievementDetailView,
)

urlpatterns = [
    # Auth
    path('auth/login/', AdminLoginView.as_view(), name='admin-auth-login'),
    path('auth/logout/', AdminLogoutView.as_view(), name='admin-auth-logout'),
    path('auth/me/', AdminMeView.as_view(), name='admin-auth-me'),

    # Dashboard
    path('dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),

    # Volunteers
    path('volunteers/export/', AdminVolunteerExportCSVView.as_view(), name='admin-volunteers-export'),
    path('volunteers/', AdminVolunteerListView.as_view(), name='admin-volunteers-list'),
    path('volunteers/<int:pk>/', AdminVolunteerDetailView.as_view(), name='admin-volunteers-detail'),

    # Donations
    path('donations/export/', AdminDonationExportCSVView.as_view(), name='admin-donations-export'),
    path('donations/', AdminDonationListView.as_view(), name='admin-donations-list'),
    path('donations/<int:pk>/', AdminDonationDetailView.as_view(), name='admin-donations-detail'),

    # Messages
    path('messages/', AdminContactMessageListView.as_view(), name='admin-messages-list'),
    path('messages/<int:pk>/', AdminContactMessageDetailView.as_view(), name='admin-messages-detail'),

    # Campaigns
    path('campaigns/categories/', AdminCampaignCategoryListCreateView.as_view(), name='admin-campaigns-categories'),
    path('campaigns/<int:campaign_id>/updates/', AdminCampaignUpdateCreateView.as_view(), name='admin-campaigns-add-update'),
    path('campaigns/updates/<int:pk>/', AdminCampaignUpdateDetailView.as_view(), name='admin-campaigns-delete-update'),
    path('campaigns/', AdminCampaignListCreateView.as_view(), name='admin-campaigns-list'),
    path('campaigns/<int:pk>/', AdminCampaignDetailView.as_view(), name='admin-campaigns-detail'),

    # Gallery & Media Uploads
    path('gallery/categories/', AdminGalleryCategoryListCreateView.as_view(), name='admin-gallery-categories'),
    path('gallery/', AdminGalleryItemListCreateView.as_view(), name='admin-gallery-list'),
    path('gallery/<int:pk>/', AdminGalleryItemDetailView.as_view(), name='admin-gallery-detail'),
    path('upload-image/', AdminImageUploadView.as_view(), name='admin-upload-image'),

    # Services
    path('services/', AdminServiceListCreateView.as_view(), name='admin-services-list'),
    path('services/<int:pk>/', AdminServiceDetailView.as_view(), name='admin-services-detail'),

    # Foundation Settings
    path('foundation/profile/', AdminFoundationProfileView.as_view(), name='admin-foundation-profile'),
    path('foundation/team/', AdminTeamMemberListCreateView.as_view(), name='admin-foundation-team-list'),
    path('foundation/team/<int:pk>/', AdminTeamMemberDetailView.as_view(), name='admin-foundation-team-detail'),
    path('foundation/metrics/', AdminImpactMetricListCreateView.as_view(), name='admin-foundation-metrics-list'),
    path('foundation/metrics/<int:pk>/', AdminImpactMetricDetailView.as_view(), name='admin-foundation-metrics-detail'),
    path('foundation/achievements/', AdminAchievementListCreateView.as_view(), name='admin-foundation-achievements-list'),
    path('foundation/achievements/<int:pk>/', AdminAchievementDetailView.as_view(), name='admin-foundation-achievements-detail'),
]
