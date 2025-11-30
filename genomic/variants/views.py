from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Variant
from .serializers import (
    VariantSerializer,
    VariantListSerializer,
    VariantCreateUpdateSerializer
)


@extend_schema_view(
    list=extend_schema(description='List all genetic variants', tags=['Variants']),
    retrieve=extend_schema(description='Get variant details', tags=['Variants']),
    create=extend_schema(description='Create a new variant', tags=['Variants']),
    update=extend_schema(description='Update a variant', tags=['Variants']),
    partial_update=extend_schema(description='Partially update a variant', tags=['Variants']),
    destroy=extend_schema(description='Delete a variant', tags=['Variants']),
)
class VariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing genetic variants
    """
    queryset = Variant.objects.select_related('gene').all()
    serializer_class = VariantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['gene', 'variant_type', 'clinical_significance', 'is_active']
    search_fields = ['variant_name', 'gene__gene_symbol', 'dbsnp_id', 'effect_description']
    ordering_fields = ['variant_name', 'created_at', 'clinical_significance']
    ordering = ['gene__gene_symbol', 'variant_name']

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return VariantListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return VariantCreateUpdateSerializer
        return VariantSerializer

    @extend_schema(
        description='Get variants by clinical significance',
        tags=['Variants']
    )
    @action(detail=False, methods=['get'])
    def by_significance(self, request):
        """Get variants grouped by clinical significance"""
        significance = request.query_params.get('significance', None)

        if significance:
            variants = self.queryset.filter(
                clinical_significance=significance,
                is_active=True
            )
            serializer = VariantListSerializer(variants, many=True)
            return Response({
                'clinical_significance': significance,
                'count': variants.count(),
                'variants': serializer.data
            })
        else:
            # Return counts by significance
            from django.db.models import Count
            significance_counts = self.queryset.values('clinical_significance').annotate(
                count=Count('id')
            ).order_by('-count')

            return Response({
                'significance_distribution': list(significance_counts)
            })

    @extend_schema(
        description='Get variant statistics',
        tags=['Variants']
    )
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get general statistics about variants"""
        from django.db.models import Count

        total_variants = Variant.objects.count()
        active_variants = Variant.objects.filter(is_active=True).count()

        # Count by type
        type_counts = Variant.objects.values('variant_type').annotate(
            count=Count('id')
        ).order_by('-count')

        # Count by significance
        significance_counts = Variant.objects.values('clinical_significance').annotate(
            count=Count('id')
        ).order_by('-count')

        return Response({
            'total_variants': total_variants,
            'active_variants': active_variants,
            'inactive_variants': total_variants - active_variants,
            'by_type': list(type_counts),
            'by_significance': list(significance_counts)
        })