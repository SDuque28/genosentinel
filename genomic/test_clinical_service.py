import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'genomic.settings')
django.setup()

from reports.services import ClinicalService

# Test the clinical service
service = ClinicalService()

print("Testing Clinical Service Connection...")
print("-" * 50)

try:
    # Test get all patients
    print("\n1. Fetching all patients...")
    patients = service.get_all_patients()
    print(f"✓ Found {len(patients)} patients")

    if patients:
        print("\nFirst patient:")
        print(patients[0])

        # Test get specific patient
        patient_id = patients[0]['id']
        print(f"\n2. Fetching patient with ID {patient_id}...")
        patient = service.get_patient(patient_id)
        print(f"✓ Patient: {patient['firstName']} {patient['lastName']}")
        print(f"  Birth Date: {patient['birthDate']}")
        print(f"  Gender: {patient['gender']}")
        print(f"  Status: {patient['status']}")

    print("\n✓ Clinical service is working correctly!")

except Exception as e:
    print(f"\n✗ Error: {e}")
    print("\nMake sure the NestJS microservice is running on http://localhost:3000")