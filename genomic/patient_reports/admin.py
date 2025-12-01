from django.contrib import admin
from .models import PatientVariantReport


@admin.register(PatientVariantReport)
class PatientVariantReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_id', 'variant', 'detection_date', 'allele_frequency']
    list_filter = ['detection_date']
    search_fields = ['patient_id', 'variant__gene__symbol']