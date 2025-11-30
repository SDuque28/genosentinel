from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Gene
from .serializers import GeneSerializer, GeneListSerializer


@extend_schema_view(
    list=extend_schema(description='List all genes', tags=['Genes']),
    retrieve=extend_schema(description='Get gene details', tags=['Genes']),
    create=extend_schema(description='Create a new gene', tags=['Genes']),
    update=extend_schema(description='Update a gene', tags=['Genes']),
    partial_update=extend_schema(description='Partially update a gene', tags=['Genes']),
    destroy=extend_schema(description='Delete a gene', tags=['Genes']),
)
class GeneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing genes of oncological interest
    """
    queryset = Gene.objects.all()
    serializer_class = GeneSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['chromosome', 'is_active']
    search_fields = ['gene_symbol', 'gene_name', 'function']
    ordering_fields = ['gene_symbol', 'created_at']
    ordering = ['gene_symbol']

    def get_serializer_class(self):
        """Use different serializer for list view"""
        if self.action == 'list':
            return GeneListSerializer
        return GeneSerializer

    @extend_schema(
        description='Get all variants for a specific gene',
        tags=['Genes']
    )
    @action(detail=True, methods=['get'])
    def variants(self, request, pk=None):
        """Get all variants associated with this gene"""
        gene = self.get_object()
        variants = gene.variants.filter(is_active=True)

        from variants.serializers import VariantListSerializer
        serializer = VariantListSerializer(variants, many=True)

        return Response({
            'gene': GeneListSerializer(gene).data,
            'variant_count': variants.count(),
            'variants': serializer.data
        })

    @extend_schema(
        description='Get gene statistics',
        tags=['Genes']
    )
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get general statistics about genes"""
        total_genes = Gene.objects.count()
        active_genes = Gene.objects.filter(is_active=True).count()

        # Count by chromosome
        chromosome_counts = {}
        for gene in Gene.objects.all():
            chrom = gene.chromosome
            chromosome_counts[chrom] = chromosome_counts.get(chrom, 0) + 1

        return Response({
            'total_genes': total_genes,
            'active_genes': active_genes,
            'inactive_genes': total_genes - active_genes,
            'genes_by_chromosome': chromosome_counts
        })