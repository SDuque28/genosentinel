from rest_framework import serializers
from .models import Variant
from genes.serializers import GeneListSerializer


class VariantSerializer(serializers.ModelSerializer):
    """
    Serializer for Variant model (DTO)
    """
    gene_details = GeneListSerializer(source='gene', read_only=True)

    class Meta:
        model = Variant
        fields = [
            'id',
            'gene',
            'gene_details',
            'variant_name',
            'variant_type',
            'chromosome_position',
            'reference_allele',
            'alternate_allele',
            'clinical_significance',
            'effect_description',
            'dbsnp_id',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate variant data"""
        # Ensure reference and alternate alleles are different
        if data.get('reference_allele') == data.get('alternate_allele'):
            raise serializers.ValidationError(
                "Reference and alternate alleles must be different"
            )
        return data


class VariantListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing variants
    """
    gene_symbol = serializers.CharField(source='gene.gene_symbol', read_only=True)

    class Meta:
        model = Variant
        fields = [
            'id',
            'gene',
            'gene_symbol',
            'variant_name',
            'variant_type',
            'clinical_significance',
            'is_active'
        ]


class VariantCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating variants
    """

    class Meta:
        model = Variant
        fields = [
            'gene',
            'variant_name',
            'variant_type',
            'chromosome_position',
            'reference_allele',
            'alternate_allele',
            'clinical_significance',
            'effect_description',
            'dbsnp_id',
            'is_active'
        ]