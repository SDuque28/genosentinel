import os
import django
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'genomic.settings')
django.setup()

from django.db import connection

try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        print("✓ Database connection successful!")
        print(f"✓ Connected to: {connection.settings_dict['NAME']}")
        print(f"✓ User: {connection.settings_dict['USER']}")
        print(f"✓ Host: {connection.settings_dict['HOST']}")
except Exception as e:
    print(f"✗ Database connection failed: {e}")