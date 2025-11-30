import requests
from django.conf import settings
from utils.exceptions import ClinicalServiceError, PatientNotFoundError
import logging

logger = logging.getLogger(__name__)


class ClinicalService:
    """
    Service to interact with the Clinical Microservice
    """

    def __init__(self):
        self.base_url = settings.CLINICAL_SERVICE_URL
        self.timeout = 10  # seconds

    def get_patient(self, patient_id):
        """
        Get patient information by ID from clinical microservice

        Args:
            patient_id: Patient identifier

        Returns:
            dict: Patient data

        Raises:
            PatientNotFoundError: If patient doesn't exist
            ClinicalServiceError: If service is unavailable
        """
        url = f"{self.base_url}/patients/{patient_id}"

        try:
            response = requests.get(url, timeout=self.timeout)

            if response.status_code == 404:
                raise PatientNotFoundError(
                    f"Patient with ID {patient_id} not found in clinical service"
                )

            response.raise_for_status()
            return response.json()

        except requests.exceptions.Timeout:
            logger.error(f"Timeout connecting to clinical service: {url}")
            raise ClinicalServiceError("Clinical service timeout")

        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error to clinical service: {url}")
            raise ClinicalServiceError("Cannot connect to clinical service")

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching patient {patient_id}: {str(e)}")
            raise ClinicalServiceError(f"Error fetching patient data: {str(e)}")

    def get_all_patients(self):
        """
        Get all patients from clinical microservice

        Returns:
            list: List of patients

        Raises:
            ClinicalServiceError: If service is unavailable
        """
        url = f"{self.base_url}/patients"

        try:
            response = requests.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching patients: {str(e)}")
            raise ClinicalServiceError(f"Error fetching patients: {str(e)}")

    def validate_patient_exists(self, patient_id):
        """
        Validate if a patient exists in the clinical service

        Args:
            patient_id: Patient identifier

        Returns:
            bool: True if patient exists
        """
        try:
            self.get_patient(patient_id)
            return True
        except PatientNotFoundError:
            return False
        except ClinicalServiceError:
            # If service is down, we allow the operation to continue
            # This prevents blocking if the microservice is temporarily unavailable
            logger.warning(
                f"Could not validate patient {patient_id} - clinical service unavailable"
            )
            return True