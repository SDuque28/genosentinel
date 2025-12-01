from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import PatientVariantReport
from .serializers import PatientVariantReportSerializer


@extend_schema_view(
    list=extend_schema(description='List all patient variant reports', tags=['Patient Reports']),
    create=extend_schema(description='Create a new patient variant report', tags=['Patient Reports']),
    retrieve=extend_schema(description='Get report by ID', tags=['Patient Reports']),
    partial_update=extend_schema(description='Update report', tags=['Patient Reports']),
    destroy=extend_schema(description='Delete report', tags=['Patient Reports']),
)
class PatientVariantReportViewSet(viewsets.ModelViewSet):
    """
    Patient variant report management
    Endpoints:
    - GET /api/reports/ - List all reports
    - POST /api/reports/ - Create report
    - GET /api/reports/{id}/ - Get report by ID
    - PATCH /api/reports/{id}/ - Update report
    - DELETE /api/reports/{id}/ - Delete report
    """
    queryset = PatientVariantReport.objects.select_related('variant__gene').all()
    serializer_class = PatientVariantReportSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']