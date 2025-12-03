from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import GeneticVariant
from .serializers import GeneticVariantSerializer


@extend_schema_view(
    list=extend_schema(description='List all genetic variants', tags=['Genetic Variants']),
    create=extend_schema(description='Create a new genetic variant', tags=['Genetic Variants']),
    retrieve=extend_schema(description='Get variant by ID', tags=['Genetic Variants']),
    partial_update=extend_schema(description='Update variant', tags=['Genetic Variants']),
    destroy=extend_schema(description='Delete variant', tags=['Genetic Variants']),
)
class GeneticVariantViewSet(viewsets.ModelViewSet):
    """
    Genetic variant management
    Endpoints:
    - GET /api/variants/ - List all variants
    - POST /api/variants/ - Create variant
    - GET /api/variants/{id}/ - Get variant by ID
    - PATCH /api/variants/{id}/ - Update variant
    - DELETE /api/variants/{id}/ - Delete variant
    """
    queryset = GeneticVariant.objects.select_related('gene').all()
    serializer_class = GeneticVariantSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']