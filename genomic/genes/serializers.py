from rest_framework import serializers
from .models import Gene


class GeneSerializer(serializers.ModelSerializer):
    """Gene serializer"""

    class Meta:
        model = Gene
        fields = ['id', 'symbol', 'full_name', 'function_summary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']