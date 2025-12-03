from rest_framework import serializers
from .models import PatientVariantReport
from genetic_variants.serializers import GeneticVariantSerializer
from .services import ClinicalService


class PatientVariantReportSerializer(serializers.ModelSerializer):
    """Patient variant report serializer"""
    variant_details = GeneticVariantSerializer(source='variant', read_only=True)
    patient_data = serializers.SerializerMethodField()

    class Meta:
        model = PatientVariantReport
        fields = [
            'id',
            'patient_id',
            'patient_data',
            'variant',
            'variant_details',
            'detection_date',
            'allele_frequency',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_patient_data(self, obj):
        """Fetch patient data from clinical microservice"""
        try:
            clinical_service = ClinicalService()
            patient = clinical_service.get_patient(obj.patient_id)
            if patient:
                return {
                    'id': patient.get('id'),
                    'first_name': patient.get('firstName'),
                    'last_name': patient.get('lastName'),
                    'birth_date': patient.get('birthDate'),
                    'gender': patient.get('gender'),
                    'status': patient.get('status')
                }
        except Exception as e:
            pass
        return {'id': obj.patient_id}

    def validate_patient_id(self, value):
        """Validate patient exists in clinical service"""
        clinical_service = ClinicalService()
        if not clinical_service.validate_patient_exists(value):
            raise serializers.ValidationError(
                f"Patient with ID {value} not found in clinical service"
            )
        return value

    def validate_allele_frequency(self, value):
        """Validate allele frequency is between 0 and 1"""
        if value < 0 or value > 1:
            raise serializers.ValidationError(
                "Allele frequency must be between 0 and 1"
            )
        return value