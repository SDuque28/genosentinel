from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Gene
from .serializers import GeneSerializer


@extend_schema_view(
    list=extend_schema(description='List all genes', tags=['Genes']),
    create=extend_schema(description='Create a new gene', tags=['Genes']),
    retrieve=extend_schema(description='Get gene by ID', tags=['Genes']),
    partial_update=extend_schema(description='Update gene', tags=['Genes']),
    destroy=extend_schema(description='Delete gene', tags=['Genes']),
)
class GeneViewSet(viewsets.ModelViewSet):
    """
    Gene management
    Endpoints:
    - GET /api/genes/ - List all genes
    - POST /api/genes/ - Create gene
    - GET /api/genes/{id}/ - Get gene by ID
    - PATCH /api/genes/{id}/ - Update gene
    - DELETE /api/genes/{id}/ - Delete gene
    """
    queryset = Gene.objects.all()
    serializer_class = GeneSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']