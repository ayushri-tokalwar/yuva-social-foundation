from django.db import models

class FoundationProfile(models.Model):
    name = models.CharField(max_length=200, default="Yuva Social Foundation")
    tagline = models.CharField(max_length=300, default="Empowering Lives Through Community Engagement")
    description = models.TextField()
    about_text = models.TextField()
    mission = models.TextField()
    vision = models.TextField()
    established_year = models.PositiveIntegerField(default=2017)
    registered_year = models.PositiveIntegerField(default=2021)
    headquarters = models.CharField(max_length=200, default="Chandrapur, Maharashtra, India")
    official_email = models.EmailField(default="yuvasocialch34@gmail.com")
    official_phone = models.CharField(max_length=50, default="+91 8669264943")
    ambulance_contact = models.CharField(max_length=50, default="+91 8669264943")
    address = models.CharField(max_length=300, default="Chandrapur, Maharashtra, India")
    
    # Founder & Leadership
    founder_name = models.CharField(max_length=150, default="Anush Raju Bhagat")
    founder_title = models.CharField(max_length=150, default="President & Founder")
    founder_bio = models.TextField(blank=True)
    founder_image = models.CharField(max_length=300, blank=True, help_text="Image filename or URL")
    
    # Social Media Links
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Foundation Profile"
        verbose_name_plural = "Foundation Profiles"

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    photo = models.CharField(max_length=300, blank=True, help_text="Image filename or URL")
    bio = models.TextField(blank=True)
    is_leader = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name} - {self.role}"


class Achievement(models.Model):
    title = models.CharField(max_length=250)
    publication_name = models.CharField(max_length=200, blank=True)
    date = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    clipping_image = models.CharField(max_length=300, blank=True, help_text="Image filename or URL")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Achievement & Media Recognition"
        verbose_name_plural = "Achievements & Media Recognitions"
        ordering = ['order', '-id']

    def __str__(self):
        return self.title


class ImpactMetric(models.Model):
    label = models.CharField(max_length=150)
    value = models.CharField(max_length=50, help_text="e.g. 500+, 24/7, 100%")
    prefix = models.CharField(max_length=20, blank=True)
    suffix = models.CharField(max_length=20, blank=True)
    description = models.CharField(max_length=250, blank=True)
    icon = models.CharField(max_length=100, default="Heart", help_text="Lucide icon name")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Impact Metric"
        verbose_name_plural = "Impact Metrics"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.label}: {self.value}"
