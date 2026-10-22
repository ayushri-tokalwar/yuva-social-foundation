from django.db import models

class Volunteer(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('active', 'Active Volunteer'),
        ('contacted', 'Contacted'),
        ('archived', 'Archived'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address_line1 = models.CharField(max_length=250, help_text="Street, Area, Colony")
    address_line2 = models.CharField(max_length=150, blank=True, help_text="Apartment, Landmark")
    city = models.CharField(max_length=100, default="Chandrapur")
    state = models.CharField(max_length=100, default="Maharashtra")
    
    # Interests & Skills
    interests = models.CharField(
        max_length=300,
        blank=True,
        help_text="e.g. Food Relief, Medical Camps, Education, Emergency Support"
    )
    skills = models.CharField(
        max_length=300,
        blank=True,
        help_text="e.g. Teaching, Driving, Medical/First-Aid, Logistics, Social Media"
    )
    availability = models.CharField(
        max_length=100,
        blank=True,
        help_text="e.g. Weekends, Weekdays, Full Time, On Call"
    )
    message = models.TextField(
        blank=True,
        help_text="Why they want to join / background message"
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    internal_notes = models.TextField(blank=True, help_text="Admin internal notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Volunteer Registration"
        verbose_name_plural = "Volunteer Registrations"
        ordering = ['-created_at']

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.full_name} ({self.phone}) - {self.city}"
