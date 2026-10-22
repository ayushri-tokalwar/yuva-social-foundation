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


class YuvaSocialFoundationAdminAPITests(APITestCase):

    def setUp(self):
        from django.contrib.auth.models import User
        self.admin_user = User.objects.create_superuser(
            username='testadmin',
            email='testadmin@yuvasocial.org',
            password='Password123!'
        )
        self.regular_user = User.objects.create_user(
            username='regularuser',
            email='regular@yuvasocial.org',
            password='Password123!'
        )

        self.category = CampaignCategory.objects.create(
            name="Healthcare & Emergency",
            slug="healthcare-emergency"
        )
        self.campaign = Campaign.objects.create(
            title="Emergency Ambulance Support",
            slug="emergency-ambulance-support",
            category=self.category,
            description="24/7 ambulance support",
            featured_image="aambulance.jpeg",
            status="active"
        )
        self.volunteer = Volunteer.objects.create(
            first_name="Sunil",
            last_name="Gaikwad",
            email="sunil@example.com",
            phone="9822000000",
            city="Chandrapur",
            state="Maharashtra",
            status="pending"
        )
        self.donation = DonationRequest.objects.create(
            full_name="Rajesh Verma",
            email="rajesh@example.com",
            phone="9823000000",
            support_type="monetary",
            intended_amount=5000.00,
            status="pending"
        )
        self.message = ContactMessage.objects.create(
            name="Nilesh Bobade",
            email="nilesh@example.com",
            phone="9824000000",
            subject="general",
            message="Interested in monthly volunteering camp schedule.",
            status="unread"
        )

    def test_admin_login_success(self):
        response = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'testadmin')

    def test_admin_login_invalid_password(self):
        response = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'WrongPassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_login_regular_user_denied(self):
        response = self.client.post('/api/admin/auth/login/', {
            'username': 'regularuser',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_unauthorized_dashboard_access(self):
        response = self.client.get('/api/admin/dashboard/stats/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_dashboard_stats(self):
        login_res = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        response = self.client.get('/api/admin/dashboard/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('metrics', response.data)
        self.assertEqual(response.data['metrics']['total_campaigns'], 1)
        self.assertEqual(response.data['metrics']['total_volunteers'], 1)

    def test_admin_volunteer_status_update(self):
        login_res = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        patch_res = self.client.patch(f'/api/admin/volunteers/{self.volunteer.id}/', {
            'status': 'approved',
            'internal_notes': 'Verified phone and residential address.'
        })
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.volunteer.refresh_from_db()
        self.assertEqual(self.volunteer.status, 'approved')
        self.assertEqual(self.volunteer.internal_notes, 'Verified phone and residential address.')

    def test_admin_volunteers_csv_export(self):
        login_res = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        csv_res = self.client.get('/api/admin/volunteers/export/')
        self.assertEqual(csv_res.status_code, status.HTTP_200_OK)
        self.assertEqual(csv_res['Content-Type'], 'text/csv')

    def test_admin_donation_status_update(self):
        login_res = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        patch_res = self.client.patch(f'/api/admin/donations/{self.donation.id}/', {
            'status': 'received',
            'notes': 'Bank transfer confirmed.'
        })
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.donation.refresh_from_db()
        self.assertEqual(self.donation.status, 'received')

    def test_admin_contact_message_read_update(self):
        login_res = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        patch_res = self.client.patch(f'/api/admin/messages/{self.message.id}/', {
            'status': 'read'
        })
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.message.refresh_from_db()
        self.assertEqual(self.message.status, 'read')

    def test_admin_campaign_crud(self):
        login_res = self.client.post('/api/admin/auth/login/', {
            'username': 'testadmin',
            'password': 'Password123!'
        })
        token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        create_res = self.client.post('/api/admin/campaigns/', {
            'title': 'Tree Plantation Drive 2026',
            'description': 'Planting 1000 saplings in Tadoba buffer zone.',
            'category': self.category.id,
            'featured_image': 'YSF20.jpeg',
            'status': 'active'
        })
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        camp_id = create_res.data['id']

        # Edit campaign
        edit_res = self.client.patch(f'/api/admin/campaigns/{camp_id}/', {
            'target_beneficiaries': 'Entire Chandrapur community'
        })
        self.assertEqual(edit_res.status_code, status.HTTP_200_OK)
        self.assertEqual(edit_res.data['target_beneficiaries'], 'Entire Chandrapur community')

