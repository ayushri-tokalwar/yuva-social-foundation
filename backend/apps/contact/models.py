from django.db import models

class ContactMessage(models.Model):
    SUBJECT_CHOICES = (
        ('general', 'General Inquiry'),
        ('collaboration', 'Partnership & Collaboration'),
        ('ambulance_emergency', 'Ambulance & Medical Emergency'),
        ('blood_donation', 'Blood Donation Request / Camp'),
        ('volunteer_query', 'Volunteer Question'),
        ('media', 'Media & Press'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('in_progress', 'In Progress'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    )

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    address = models.CharField(max_length=250, blank=True, help_text="e.g. Shivaji Nagar, Chandrapur")
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    internal_notes = models.TextField(blank=True, help_text="Internal notes or response log")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.subject}) - {self.email}"
