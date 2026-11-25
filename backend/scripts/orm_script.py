import os
import sys
from pathlib import Path

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Initialize Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.Hotels.models import *
import pprint

def run():
    queryset = (
        Menu.objects.select_related('branch', 'category')
        .prefetch_related('online_platforms')
        .order_by('-created_at')
    )
    pprint.pprint(list(queryset.values('id', 'item', 'item_type', 'price', 'branch__address')))

if __name__ == '__main__':
    run()
