from django.contrib import admin
from .models import Gene


@admin.register(Gene)
class GeneAdmin(admin.ModelAdmin):
    list_display = ['gene_symbol', 'gene_name', 'chromosome', 'is_active', 'created_at']
    list_filter = ['is_active', 'chromosome']
    search_fields = ['gene_symbol', 'gene_name']
    ordering = ['gene_symbol']