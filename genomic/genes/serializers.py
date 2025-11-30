from rest_framework import serializers
from .models import Gene


class GeneSerializer(serializers.ModelSerializer):
    """
    Serializer for Gene model (DTO)
    """

    class Meta:
        model = Gene
        fields = [
            'id',
            'gene_symbol',
            'gene_name',
            'chromosome',
            'function',
            'oncological_relevance',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_gene_symbol(self, value):
        """Ensure gene symbol is uppercase"""
        return value.upper()


class GeneListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing genes
    """
    variant_count = serializers.SerializerMethodField()

    class Meta:
        model = Gene
        fields = [
            'id',
            'gene_symbol',
            'gene_name',
            'chromosome',
            'variant_count',
            'is_active'
        ]

    def get_variant_count(self, obj):
        """Get count of active variants for this gene"""
        return obj.variants.filter(is_active=True).count()