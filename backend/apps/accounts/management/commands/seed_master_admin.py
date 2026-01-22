import os
from django.core.management.base import BaseCommand
from apps.accounts.models import User


class Command(BaseCommand):
    help = "Seed master admin from environment variables"

    def handle(self, *args, **options):
        email = os.getenv("MASTER_ADMIN_EMAIL")
        password = os.getenv("MASTER_ADMIN_PASSWORD")
        full_name = os.getenv("MASTER_ADMIN_NAME", "Master Admin")

        if not email or not password:
            self.stdout.write(self.style.ERROR("MASTER_ADMIN_EMAIL and MASTER_ADMIN_PASSWORD are required"))
            return

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "role": User.Role.MASTER_ADMIN,
                "is_staff": True,
                "is_active": True,
            },
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS("Master admin created"))
        else:
            self.stdout.write(self.style.WARNING("Master admin already exists"))
