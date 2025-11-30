from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from django.db.models import Count, Q
from .models import PatientReport, ReportVariant
from .serializers import (
    PatientReportSerializer,
    PatientReportListSerializer,
    PatientReportCreateUpdateSerializer,
    ReportVariantSerializer,
    ReportVariantCreateSerializer
)
from .services import ClinicalService
from utils.exceptions import ClinicalServiceError, PatientNotFoundError


@extend_schema_view(
    list=extend_schema(description='List all patient reports', tags=['Reports']),
    retrieve=extend_schema(description='Get report details with patient data', tags=['Reports']),
    create=extend_schema(description='Create a new patient report', tags=['Reports']),
    update=extend_schema(description='Update a patient report', tags=['Reports']),
    partial_update=extend_schema(description='Partially update a patient report', tags=['Reports']),
    destroy=extend_schema(description='Delete a patient report', tags=['Reports']),
)
class PatientReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient genetic reports
    """
    queryset = PatientReport.objects.prefetch_related('report_variants__variant__gene').all()
    serializer_class = PatientReportSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['patient_id', 'status', 'report_date']
    search_fields = ['patient_id', 'test_type', 'clinical_notes']
    ordering_fields = ['report_date', 'created_at']
    ordering = ['-report_date']

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return PatientReportListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return PatientReportCreateUpdateSerializer
        return PatientReportSerializer

    @extend_schema(
        description='Add a variant to a report',
        request=ReportVariantCreateSerializer,
        tags=['Reports']
    )
    @action(detail=True, methods=['post'])
    def add_variant(self, request, pk=None):
        """Add a genetic variant to this report"""
        report = self.get_object()

        # Add report to the request data
        data = request.data.copy()
        data['report'] = report.id

        serializer = ReportVariantCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        description='Remove a variant from a report',
        parameters=[
            OpenApiParameter(
                name='variant_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Variant ID to remove'
            )
        ],
        tags=['Reports']
    )
    @action(detail=True, methods=['delete'])
    def remove_variant(self, request, pk=None):
        """Remove a variant from this report"""
        report = self.get_object()
        variant_id = request.query_params.get('variant_id')

        if not variant_id:
            return Response(
                {'error': 'variant_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            report_variant = ReportVariant.objects.get(
                report=report,
                variant_id=variant_id
            )
            report_variant.delete()
            return Response(
                {'message': 'Variant removed from report'},
                status=status.HTTP_204_NO_CONTENT
            )
        except ReportVariant.DoesNotExist:
            return Response(
                {'error': 'Variant not found in this report'},
                status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        description='Get patient information from clinical service',
        tags=['Reports']
    )
    @action(detail=True, methods=['get'])
    def patient_info(self, request, pk=None):
        """Get detailed patient information from clinical microservice"""
        report = self.get_object()

        try:
            clinical_service = ClinicalService()
            patient_data = clinical_service.get_patient(report.patient_id)

            return Response({
                'report_id': report.id,
                'patient': patient_data
            })
        except PatientNotFoundError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except ClinicalServiceError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    @extend_schema(
        description='Get report statistics',
        tags=['Reports']
    )
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get general statistics about reports"""
        total_reports = PatientReport.objects.count()

        # Count by status
        status_counts = PatientReport.objects.values('status').annotate(
            count=Count('id')
        ).order_by('-count')

        # Count unique patients
        unique_patients = PatientReport.objects.values('patient_id').distinct().count()

        # Average variants per report
        avg_variants = ReportVariant.objects.values('report').annotate(
            count=Count('id')
        ).aggregate(avg=Count('id'))

        return Response({
            'total_reports': total_reports,
            'unique_patients': unique_patients,
            'by_status': list(status_counts),
            'average_variants_per_report': avg_variants.get('avg', 0)
        })


@extend_schema_view(
    list=extend_schema(description='List all report variants', tags=['Report Variants']),
    retrieve=extend_schema(description='Get report variant details', tags=['Report Variants']),
    create=extend_schema(description='Create a report variant', tags=['Report Variants']),
    update=extend_schema(description='Update a report variant', tags=['Report Variants']),
    partial_update=extend_schema(description='Partially update a report variant', tags=['Report Variants']),
    destroy=extend_schema(description='Delete a report variant', tags=['Report Variants']),
)
class ReportVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing variants within reports
    """
    queryset = ReportVariant.objects.select_related('report', 'variant__gene').all()
    serializer_class = ReportVariantSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['report', 'variant', 'zygosity']
    ordering_fields = ['created_at', 'allele_frequency']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Use different serializer for create/update"""
        if self.action in ['create', 'update', 'partial_update']:
            return ReportVariantCreateSerializer
        return ReportVariantSerializer


class AvailablePatientsView(APIView):
    """
    View to get all available patients from the clinical microservice
    """

    @extend_schema(
        description='Get all available patients from clinical service',
        tags=['Clinical Service']
    )
    def get(self, request):
        """Get all patients from clinical service"""
        try:
            clinical_service = ClinicalService()
            patients = clinical_service.get_all_patients()

            return Response({
                'count': len(patients),
                'patients': patients
            })
        except ClinicalServiceError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )