from django.contrib import admin
from .models import GeneticVariant


@admin.register(GeneticVariant)
class GeneticVariantAdmin(admin.ModelAdmin):
    list_display = ['id', 'gene', 'chromosome', 'position', 'impact']
    list_filter = ['impact', 'chromosome']
    search_fields = ['gene__symbol', 'chromosome']