from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates default admin superuser for Yuva Social Foundation portal'

    def handle(self, *args, **kwargs):
        username = 'admin'
        email = 'yuvasocialch34@gmail.com'
        password = 'admin'

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"[OK] Created superuser '{username}' with password '{password}'"))
        else:
            self.stdout.write(self.style.NOTICE(f"Superuser '{username}' already exists."))
