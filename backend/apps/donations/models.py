import uuid
from django.db import models
from apps.campaigns.models import Campaign

class DonationRequest(models.Model):
    SUPPORT_TYPE_CHOICES = (
        ('monetary', 'Monetary Contribution (General Welfare)'),
        ('food_relief', 'Food Distribution & Grains Drive'),
        ('medical_aid', 'Medical Aid & Medicines Support'),
        ('ambulance_fuel', 'Ambulance Fuel & Emergency Support'),
        ('child_education', 'Child Education & Study Kits'),
        ('in_kind', 'In-Kind Contribution / Material Help'),
        ('other', 'Other Support'),
    )

    PAYMENT_PREFERENCE_CHOICES = (
        ('upi', 'UPI / QR Code Transfer'),
        ('bank_transfer', 'NEFT / RTGS / Direct Bank Transfer'),
        ('cheque', 'Cheque / Demand Draft'),
        ('in_person', 'In-Person / At Chandrapur Centre'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending Verification'),
        ('under_review', 'Under Review'),
        ('contacted', 'Contacted / Details Sent'),
        ('received', 'Contribution Confirmed'),
        ('receipt_issued', 'Receipt Issued'),
        ('completed', 'Completed'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    )

    reference_id = models.CharField(max_length=50, unique=True, blank=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=100, default="Chandrapur")
    state = models.CharField(max_length=100, default="Maharashtra")
    
    support_type = models.CharField(max_length=50, choices=SUPPORT_TYPE_CHOICES, default='monetary')
    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donations'
    )
    intended_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Intended amount in INR"
    )
    payment_preference = models.CharField(
        max_length=30,
        choices=PAYMENT_PREFERENCE_CHOICES,
        default='upi'
    )
    pan_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="Optional PAN for receipt"
    )
    message = models.TextField(blank=True)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, help_text="Admin internal notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Donation Support Request"
        verbose_name_plural = "Donation Support Requests"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.reference_id:
            short_id = uuid.uuid4().hex[:6].upper()
            self.reference_id = f"YSF-DON-{short_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_id} - {self.full_name} ({self.support_type})"
