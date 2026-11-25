"""
Django management command to safely seed initial restaurant categories, branches, menu items, and admin user.
Idempotent and safe to run multiple times in fresh or existing deployments (e.g. Supabase / PostgreSQL).
Usage: python manage.py seed_data
"""

import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.management import call_command
from apps.Hotels.models import User, Category, Branch, Menu


class Command(BaseCommand):
    help = "Seeds initial categories, branches, menu items, and owner admin user."

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-email',
            type=str,
            default=os.getenv('DEFAULT_ADMIN_EMAIL', 'admin@yabafastfood.com'),
            help='Admin email address to create if no users exist',
        )
        parser.add_argument(
            '--admin-password',
            type=str,
            default=os.getenv('DEFAULT_ADMIN_PASSWORD', 'YabaAdmin2026!'),
            help='Admin password to create if no users exist',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding data for Yaba Fast Food..."))

        # 1. Try loading full fixture if available
        fixture_path = Path(__file__).resolve().parent.parent.parent.parent / "fixtures" / "initial_data.json"
        if fixture_path.exists():
            try:
                self.stdout.write(f"Loading fixture from {fixture_path}...")
                call_command('loaddata', str(fixture_path))
                self.stdout.write(self.style.SUCCESS("Successfully imported fixture data!"))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Fixture load skipped: {e}"))

        # 2. Ensure categories exist
        categories = [
            "Chicken Starters",
            "Tandoor & Grills",
            "Chicken Pieces",
            "Hyderabadi Specials",
            "Veg Starters",
            "Breads",
            "Noodles",
            "Fried Rice",
        ]
        
        created_cat = 0
        for name in categories:
            _, created = Category.objects.get_or_create(name=name)
            if created:
                created_cat += 1
        self.stdout.write(self.style.SUCCESS(f"Categories ready: {Category.objects.count()} total."))

        # 3. Ensure branches exist
        branches = [
            {"address": "Tegal Kunta, Hyderabad", "phone_number": "9876543210", "email": "tegalkunta@yabafastfood.com", "location": "https://maps.google.com/?q=Tegal+Kunta+Hyderabad"},
            {"address": "Vattepally, Hyderabad", "phone_number": "9876543211", "email": "vattepally@yabafastfood.com", "location": "https://maps.google.com/?q=Vattepally+Hyderabad"},
            {"address": "Shahalibanda, Hyderabad", "phone_number": "9876543212", "email": "shahalibanda@yabafastfood.com", "location": "https://maps.google.com/?q=Shahalibanda+Hyderabad"},
            {"address": "Babanagar, Hyderabad", "phone_number": "9876543213", "email": "babanagar@yabafastfood.com", "location": "https://maps.google.com/?q=Babanagar+Hyderabad"},
            {"address": "Phool Bagh, Hyderabad", "phone_number": "9876543214", "email": "phoolbagh@yabafastfood.com", "location": "https://maps.google.com/?q=Phool+Bagh+Hyderabad"},
        ]
        for b in branches:
            Branch.objects.get_or_create(
                address=b["address"],
                defaults={"phone_number": b["phone_number"], "email": b["email"], "location": b["location"]}
            )
        self.stdout.write(self.style.SUCCESS(f"Branches ready: {Branch.objects.count()} total."))

        # 4. Ensure an Admin / Owner user exists
        if not User.objects.filter(is_staff=True).exists():
            admin_email = options['admin_email']
            admin_password = options['admin_password']
            User.objects.create_user(
                email=admin_email,
                name="Admin Owner",
                password=admin_password,
                is_staff=True,
                is_superuser=True,
            )
            self.stdout.write(self.style.SUCCESS(f"Created default admin user: {admin_email} (Password: {admin_password})"))
        else:
            staff_users = list(User.objects.filter(is_staff=True).values_list('email', flat=True))
            self.stdout.write(self.style.SUCCESS(f"Admin user(s) ready: {', '.join(staff_users)}"))

        self.stdout.write(self.style.SUCCESS("All data seeded successfully!"))
