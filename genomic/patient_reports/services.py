import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class ClinicalService:
    """
    Service to interact with Clinical Microservice
    """

    def __init__(self):
        self.base_url = settings.CLINICAL_SERVICE_URL
        self.timeout = 10

    def get_patient(self, patient_id):
        """Get patient information from clinical microservice"""
        url = f"{self.base_url}/patients/{patient_id}"

        try:
            response = requests.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching patient {patient_id}: {str(e)}")
            return None

    def validate_patient_exists(self, patient_id):
        """Check if patient exists"""
        patient = self.get_patient(patient_id)
        return patient is not None