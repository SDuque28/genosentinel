from rest_framework.exceptions import APIException


class ClinicalServiceError(APIException):
    status_code = 503
    default_detail = 'Clinical service temporarily unavailable.'
    default_code = 'clinical_service_error'


class PatientNotFoundError(APIException):
    status_code = 404
    default_detail = 'Patient not found in clinical service.'
    default_code = 'patient_not_found'