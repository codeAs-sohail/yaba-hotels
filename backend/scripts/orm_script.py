import os
import sys
from pathlib import Path

# Setup Python path and Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

# Models must be imported after django.setup()
from apps.Hotels.models import Category

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

for name in categories:
    cat, created = Category.objects.get_or_create(name=name)
    if created:
        print(f"Created category: {name}")
    else:
        print(f"Category already exists: {name}")

print("\nCategories list in database:")
for c in Category.objects.all().order_by('id'):
    print(f"- #{c.id}: {c.name}")
