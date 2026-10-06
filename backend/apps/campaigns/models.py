from django.db import models
from django.utils.text import slugify

class CampaignCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default="HeartHandshake", help_text="Lucide icon name")

    class Meta:
        verbose_name = "Campaign Category"
        verbose_name_plural = "Campaign Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Campaign(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active / Ongoing'),
        ('completed', 'Completed'),
        ('upcoming', 'Upcoming'),
    )

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    category = models.ForeignKey(
        CampaignCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='campaigns'
    )
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    story = models.TextField(blank=True, help_text="Detailed story or background")
    location = models.CharField(max_length=200, default="Chandrapur, Maharashtra")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Visual assets
    featured_image = models.CharField(max_length=300, help_text="Image filename or URL")
    banner_image = models.CharField(max_length=300, blank=True, help_text="Banner image filename or URL")
    
    # Impact / Beneficiaries
    target_beneficiaries = models.CharField(max_length=100, blank=True, help_text="e.g. 500+ Families")
    beneficiaries_helped = models.CharField(max_length=100, blank=True, help_text="Actual count or note")
    
    # Financial target (if applicable)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"
        ordering = ['-is_featured', 'order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Campaign.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CampaignUpdate(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    update_date = models.DateField()
    content = models.TextField()
    image = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Campaign Update"
        verbose_name_plural = "Campaign Updates"
        ordering = ['-update_date', '-id']

    def __str__(self):
        return f"{self.campaign.title} - {self.title}"
