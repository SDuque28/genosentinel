from django.contrib import admin
from .models import Gene


@admin.register(Gene)
class GeneAdmin(admin.ModelAdmin):
    list_display = ['id', 'symbol', 'full_name']
    search_fields = ['symbol', 'full_name']