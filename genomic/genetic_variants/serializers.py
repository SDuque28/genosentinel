from rest_framework import serializers
from .models import GeneticVariant
from genes.serializers import GeneSerializer


class GeneticVariantSerializer(serializers.ModelSerializer):
    """Genetic variant serializer"""
    gene_details = GeneSerializer(source='gene', read_only=True)

    class Meta:
        model = GeneticVariant
        fields = [
            'id',
            'gene',
            'gene_details',
            'chromosome',
            'position',
            'reference_base',
            'alternate_base',
            'impact',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']