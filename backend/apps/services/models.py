from django.db import models
from django.utils.text import slugify

class Service(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    icon = models.CharField(max_length=100, default="Heart", help_text="Lucide icon name")
    short_description = models.TextField()
    detailed_description = models.TextField(blank=True)
    image = models.CharField(max_length=300, help_text="Image filename or URL")
    key_points = models.TextField(
        blank=True,
        help_text="Newline separated bullet points for services offered"
    )
    is_highlighted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Welfare Service"
        verbose_name_plural = "Welfare Services"
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
