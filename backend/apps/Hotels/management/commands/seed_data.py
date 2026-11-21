"""
Django management command to safely seed initial restaurant categories and branches.
Idempotent and safe to run multiple times in fresh or existing deployments.
Usage: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from apps.Hotels.models import Category, Branch


class Command(BaseCommand):
    help = "Seeds standard categories and branch locations for Yaba Fast Food."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding initial data for Yaba Fast Food..."))

        # 1. Standard Food Categories
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

        created_categories = 0
        for name in categories:
            cat, created = Category.objects.get_or_create(name=name)
            if created:
                created_categories += 1

        self.stdout.write(
            self.style.SUCCESS(f"Categories ready: {len(categories)} total ({created_categories} new).")
        )

        # 2. Standard Hyderabad Branches
        branches = [
            {
                "address": "Tegal Kunta, Hyderabad",
                "phone_number": "9876543210",
                "email": "tegalkunta@yabafastfood.com",
                "location": "https://maps.google.com/?q=Tegal+Kunta+Hyderabad",
            },
            {
                "address": "Vattepally, Hyderabad",
                "phone_number": "9876543211",
                "email": "vattepally@yabafastfood.com",
                "location": "https://maps.google.com/?q=Vattepally+Hyderabad",
            },
            {
                "address": "Shahalibanda, Hyderabad",
                "phone_number": "9876543212",
                "email": "shahalibanda@yabafastfood.com",
                "location": "https://maps.google.com/?q=Shahalibanda+Hyderabad",
            },
            {
                "address": "Babanagar, Hyderabad",
                "phone_number": "9876543213",
                "email": "babanagar@yabafastfood.com",
                "location": "https://maps.google.com/?q=Babanagar+Hyderabad",
            },
            {
                "address": "Phool Bagh, Hyderabad",
                "phone_number": "9876543214",
                "email": "phoolbagh@yabafastfood.com",
                "location": "https://maps.google.com/?q=Phool+Bagh+Hyderabad",
            },
        ]

        created_branches = 0
        for b_data in branches:
            branch, created = Branch.objects.get_or_create(
                address=b_data["address"],
                defaults={
                    "phone_number": b_data["phone_number"],
                    "email": b_data["email"],
                    "location": b_data["location"],
                },
            )
            if created:
                created_branches += 1

        self.stdout.write(
            self.style.SUCCESS(f"Branches ready: {len(branches)} total ({created_branches} new).")
        )
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
