import sys
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.Hotels.models import Branch, Category, Menu

# Target branches to seed (Vattepally is strictly excluded)
BRANCHES = ["Tegal Kunta", "Shahalibanda", "Babanagar", "Phool Bagh"]

# Categories in exact order
CATEGORIES = [
    "Chicken Starters",
    "Tandoor & Grills",
    "Chicken Pieces",
    "Hyderabadi Specials",
    "Veg Starters",
    "Breads",
    "Noodles",
    "Fried Rice",
]

# Menu data tuple format: (name, price_single, price_full, is_veg, unit_note)
MENU = {
    "Noodles": [
        ("Regular Noodles",                    70, 120, True,  None),
        ("Egg Noodles",                        70, 120, False, None),
        ("Double Egg Noodles",                 90, 130, False, None),
        ("Veg Noodles",                        70, 120, True,  None),
        ("Special Chicken Noodles",           110, 170, False, None),
        ("Special Double Egg Chicken Noodles", 120, 180, False, None),
        ("Double Egg Double Chicken Noodles", 140, 200, False, None),
        ("Schezwan Noodles",                  120, 190, True,  None),
    ],
    "Fried Rice": [
        ("Regular Fried Rice",                 70, 120, True,  None),
        ("Egg Fried Rice",                     70, 120, False, None),
        ("Double Egg Fried Rice",              90, 130, False, None),
        ("Veg Fried Rice",                     70, 120, True,  None),
        ("Zeera Rice",                         70, 120, True,  None),
        ("Special Chicken Fried Rice",        110, 170, False, None),
        ("Special Double Egg Fried Rice",     120, 180, False, None),
        ("Double Egg Double Chicken Fried Rice", 140, 200, False, None),
        ("Schezwan Fried Rice",               120, 190, True,  None),
    ],
    "Chicken Starters": [
        ("Chicken 65",                        140, 230, False, None),
        ("Schezwan Chicken 65",               160, 250, False, None),
        ("Chicken 65 Gravy",                  140, 230, False, None),
        ("Chicken Manchurian",                140, 230, False, None),
        ("Chicken Deep Fry",                  140, 230, False, None),
        ("Chicken Fry",                       170, 320, False, None),
    ],
    "Tandoor & Grills": [
        ("Chicken Tandoori",                  170, 320, False, None),
    ],
    "Chicken Pieces": [
        ("Chicken Lollipop",                  120, None, False, "7 pcs"),
        ("Chicken Leg Piece",                  90, None, False, "1 pc"),
        ("Chicken Chest Piece",                90, None, False, "1 pc"),
    ],
    "Hyderabadi Specials": [
        ("Talawa Gosht",                      140, 230, False, None),
    ],
    "Veg Starters": [
        ("Veg Manchurian",                     80, 130, True,  None),
    ],
    "Breads": [
        ("Romali Roti",                        12, None, True,  None),
    ],
}


class Command(BaseCommand):
    help = "Seeds database with full menu for 4 branches of Yaba Fast Food."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate seeding without committing database changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        if dry_run:
            self.stdout.write(self.style.WARNING("--- DRY RUN MODE (No data will be committed) ---"))

        with transaction.atomic():
            # 1. Categories (reused via get_or_create)
            category_map = {}
            for cat_name in CATEGORIES:
                cat_obj, created = Category.objects.get_or_create(name=cat_name)
                category_map[cat_name] = cat_obj
                status = "Created" if created else "Reused"
                self.stdout.write(f"Category '{cat_name}': {status}")

            # 2. Branches: match 4 target branches case-insensitively
            branch_map = {}
            for b_name in BRANCHES:
                # Never touch Vattepally
                if "vattepally" in b_name.lower():
                    continue

                branch_obj = Branch.objects.filter(address__icontains=b_name).first()
                if not branch_obj:
                    # Missing branch: create with name in address and standard defaults
                    branch_obj = Branch.objects.create(
                        address=f"{b_name}, Hyderabad",
                        phone_number="9876543210",
                        email=f"{b_name.lower().replace(' ', '')}@yabafastfood.com",
                    )
                    self.stdout.write(self.style.SUCCESS(f"Created missing branch: {branch_obj.address}"))
                else:
                    self.stdout.write(f"Reusing existing branch: {branch_obj.address} (ID: {branch_obj.id})")
                branch_map[b_name] = branch_obj

            # 3. Seed Menu items for each branch separately
            created_count = 0
            updated_count = 0

            for b_name, branch_obj in branch_map.items():
                self.stdout.write(self.style.NOTICE(f"\nProcessing branch: {branch_obj.address}"))
                for cat_name, items in MENU.items():
                    cat_obj = category_map[cat_name]
                    for name, price_single, price_full, is_veg, unit_note in items:
                        # Existing Menu model fields: item, branch, category, price, description, item_type, image
                        defaults = {
                            "category": cat_obj,
                            "price": price_single,
                            "description": unit_note if unit_note else "",
                            "item_type": "single",
                        }

                        if dry_run:
                            exists = Menu.objects.filter(branch=branch_obj, item=name).first()
                            if exists:
                                updated_count += 1
                                self.stdout.write(f"  [WOULD UPDATE] {name} (₹{price_single}) -> {cat_name}")
                            else:
                                created_count += 1
                                self.stdout.write(f"  [WOULD CREATE] {name} (₹{price_single}) -> {cat_name}")
                        else:
                            existing_qs = Menu.objects.filter(branch=branch_obj, item=name)
                            if existing_qs.exists():
                                menu_item = existing_qs.filter(item_type="single").first() or existing_qs.first()
                                for k, v in defaults.items():
                                    setattr(menu_item, k, v)
                                menu_item.save()
                                updated_count += 1
                                self.stdout.write(f"  [UPDATED] {name} (₹{price_single}) -> {cat_name}")
                                # Clean up duplicate portion rows if any
                                extras = existing_qs.exclude(id=menu_item.id)
                                if extras.exists():
                                    extras.delete()
                            else:
                                Menu.objects.create(
                                    branch=branch_obj,
                                    item=name,
                                    **defaults
                                )
                                created_count += 1
                                self.stdout.write(f"  [CREATED] {name} (₹{price_single}) -> {cat_name}")

            if dry_run:
                self.stdout.write(self.style.WARNING(
                    f"\nDry run summary: {created_count} items would be created, {updated_count} items would be updated."
                ))
                transaction.set_rollback(True)
            else:
                self.stdout.write(self.style.SUCCESS(
                    f"\nSeeding completed: {created_count} created, {updated_count} updated across {len(branch_map)} branches."
                ))
