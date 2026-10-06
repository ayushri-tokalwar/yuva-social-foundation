from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.foundation.models import FoundationProfile, TeamMember
from apps.campaigns.models import CampaignCategory, Campaign
from apps.services.models import Service
from apps.volunteers.models import Volunteer
from apps.donations.models import DonationRequest
from apps.contact.models import ContactMessage

class YuvaSocialFoundationAPITests(APITestCase):

    def setUp(self):
        self.profile = FoundationProfile.objects.create(
            name="Yuva Social Foundation",
            tagline="Empowering Lives",
            description="Social welfare organization.",
            mission="To serve humanity.",
            vision="To build an inclusive society.",
            official_email="yuvasocialch34@gmail.com",
            official_phone="+91 8669264943",
        )
        self.category = CampaignCategory.objects.create(
            name="Healthcare & Emergency",
            slug="healthcare-emergency"
        )
        self.campaign = Campaign.objects.create(
            title="Emergency Ambulance Support",
            slug="emergency-ambulance-support",
            category=self.category,
            description="24/7 ambulance support in Chandrapur",
            featured_image="aambulance.jpeg",
            status="active",
            is_featured=True
        )
        self.service = Service.objects.create(
            title="Healthcare Initiatives",
            slug="healthcare-initiatives",
            short_description="Free medical checkups",
            image="Health4.jpg",
            is_highlighted=True
        )

    def test_api_discovery_root(self):
        """Test API discovery endpoint."""
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('endpoints', response.data)

    def test_foundation_overview(self):
        """Test overview endpoint."""
        response = self.client.get('/api/foundation/overview/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['profile']['name'], "Yuva Social Foundation")

    def test_campaigns_list(self):
        """Test campaigns list endpoint."""
        response = self.client.get('/api/campaigns/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_campaign_detail(self):
        """Test campaign detail by slug."""
        response = self.client.get(f'/api/campaigns/{self.campaign.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Emergency Ambulance Support")

    def test_services_list(self):
        """Test services list endpoint."""
        response = self.client.get('/api/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_volunteer_submission_success(self):
        """Test submitting volunteer form."""
        payload = {
            "first_name": "Rohan",
            "last_name": "Sharma",
            "email": "rohan.sharma@example.com",
            "phone": "9876543210",
            "address_line1": "Ram Nagar, Ward 5",
            "city": "Chandrapur",
            "state": "Maharashtra",
            "interests": "Food Relief, Medical Aid",
            "skills": "First-aid, Driving",
            "availability": "Weekends",
            "message": "I want to help poor people in my city."
        }
        response = self.client.post('/api/volunteers/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(Volunteer.objects.filter(email="rohan.sharma@example.com").count(), 1)

    def test_volunteer_submission_validation_error(self):
        """Test volunteer validation failure with invalid phone."""
        payload = {
            "first_name": "R",
            "last_name": "S",
            "email": "invalid-email",
            "phone": "123",
            "address_line1": ""
        }
        response = self.client.post('/api/volunteers/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_donation_request_submission(self):
        """Test submitting donation/support intent."""
        payload = {
            "full_name": "Priya Deshmukh",
            "email": "priya.d@example.com",
            "phone": "9123456789",
            "city": "Chandrapur",
            "state": "Maharashtra",
            "support_type": "food_relief",
            "campaign": self.campaign.id,
            "intended_amount": 2500.00,
            "payment_preference": "upi",
            "message": "Supporting hunger relief for poor families."
        }
        response = self.client.post('/api/donations/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertTrue(response.data['data']['reference_id'].startswith("YSF-DON-"))
        self.assertEqual(DonationRequest.objects.filter(email="priya.d@example.com").count(), 1)

    def test_contact_submission(self):
        """Test submitting contact message."""
        payload = {
            "name": "Amit Patil",
            "email": "amit.patil@example.com",
            "phone": "8877665544",
            "address": "Civil Lines, Chandrapur",
            "subject": "ambulance_emergency",
            "message": "Need ambulance coordination for medical camp next Sunday."
        }
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(ContactMessage.objects.filter(email="amit.patil@example.com").count(), 1)
