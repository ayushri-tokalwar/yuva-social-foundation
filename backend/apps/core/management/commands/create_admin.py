from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates or resets default admin superuser for Yuva Social Foundation portal'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin', help='Admin username')
        parser.add_argument('--password', type=str, default='admin123', help='Admin password')
        parser.add_argument('--email', type=str, default='yuvasocialch34@gmail.com', help='Admin email')
        parser.add_argument('--reset', action='store_true', help='Force reset password if user exists')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        force_reset = options['reset']

        user = User.objects.filter(username=username).first()
        if not user:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"[OK] Created superuser '{username}' with password '{password}'"))
        else:
            if force_reset:
                user.set_password(password)
                user.is_staff = True
                user.is_superuser = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f"[OK] Reset password for superuser '{username}' to '{password}'"))
            else:
                self.stdout.write(self.style.NOTICE(f"Superuser '{username}' already exists. Use --reset to update password."))
