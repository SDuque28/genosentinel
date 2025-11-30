from rest_framework import serializers
from .models import PatientReport, ReportVariant
from variants.serializers import VariantListSerializer
from utils.validators import validate_allele_frequency, validate_coverage
from .services import ClinicalService


class ReportVariantSerializer(serializers.ModelSerializer):
    """
    Serializer for ReportVariant model (DTO)
    """
    variant_details = VariantListSerializer(source='variant', read_only=True)
    allele_frequency = serializers.DecimalField(
        max_digits=5,
        decimal_places=4,
        validators=[validate_allele_frequency]
    )
    coverage = serializers.IntegerField(validators=[validate_coverage])

    class Meta:
        model = ReportVariant
        fields = [
            'id',
            'variant',
            'variant_details',
            'zygosity',
            'allele_frequency',
            'coverage',
            'interpretation',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PatientReportSerializer(serializers.ModelSerializer):
    """
    Serializer for PatientReport model with patient data from microservice
    """
    report_variants = ReportVariantSerializer(many=True, read_only=True)
    patient_data = serializers.SerializerMethodField()
    variant_count = serializers.SerializerMethodField()

    class Meta:
        model = PatientReport
        fields = [
            'id',
            'patient_id',
            'patient_data',
            'report_date',
            'test_type',
            'status',
            'clinical_notes',
            'variant_count',
            'report_variants',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_patient_data(self, obj):
        """Fetch patient data from clinical microservice"""
        try:
            clinical_service = ClinicalService()
            patient = clinical_service.get_patient(obj.patient_id)
            return {
                'id': patient.get('id'),
                'first_name': patient.get('firstName'),
                'last_name': patient.get('lastName'),
                'birth_date': patient.get('birthDate'),
                'gender': patient.get('gender'),
                'status': patient.get('status')
            }
        except Exception as e:
            # If patient data cannot be fetched, return basic info
            return {
                'id': obj.patient_id,
                'error': str(e)
            }

    def get_variant_count(self, obj):
        """Get count of variants in this report"""
        return obj.report_variants.count()


class PatientReportListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing reports
    """
    variant_count = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientReport
        fields = [
            'id',
            'patient_id',
            'patient_name',
            'report_date',
            'test_type',
            'status',
            'variant_count',
            'created_at'
        ]

    def get_variant_count(self, obj):
        return obj.report_variants.count()

    def get_patient_name(self, obj):
        """Get patient name from clinical microservice"""
        try:
            clinical_service = ClinicalService()
            patient = clinical_service.get_patient(obj.patient_id)
            return f"{patient.get('firstName', '')} {patient.get('lastName', '')}"
        except:
            return "Unknown"


class PatientReportCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating patient reports
    """

    class Meta:
        model = PatientReport
        fields = [
            'patient_id',
            'report_date',
            'test_type',
            'status',
            'clinical_notes'
        ]

    def validate_patient_id(self, value):
        """Validate patient exists in clinical microservice"""
        clinical_service = ClinicalService()
        if not clinical_service.validate_patient_exists(value):
            raise serializers.ValidationError(
                f"Patient with ID {value} not found in clinical service"
            )
        return value


class ReportVariantCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for adding variants to a report
    """
    allele_frequency = serializers.DecimalField(
        max_digits=5,
        decimal_places=4,
        validators=[validate_allele_frequency]
    )
    coverage = serializers.IntegerField(validators=[validate_coverage])

    class Meta:
        model = ReportVariant
        fields = [
            'report',
            'variant',
            'zygosity',
            'allele_frequency',
            'coverage',
            'interpretation'
        ]

    def validate(self, data):
        """Validate report variant"""
        # Check if this variant is already in the report
        if ReportVariant.objects.filter(
                report=data['report'],
                variant=data['variant']
        ).exists():
            raise serializers.ValidationError(
                "This variant is already in the report"
            )
        return data