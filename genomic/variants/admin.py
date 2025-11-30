from django.contrib import admin
from .models import Variant


@admin.register(Variant)
class VariantAdmin(admin.ModelAdmin):
    list_display = ['variant_name', 'gene', 'variant_type', 'clinical_significance', 'is_active']
    list_filter = ['variant_type', 'clinical_significance', 'is_active']
    search_fields = ['variant_name', 'gene__gene_symbol', 'dbsnp_id']
    ordering = ['gene__gene_symbol', 'variant_name']