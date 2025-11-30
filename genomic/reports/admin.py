from django.contrib import admin
from .models import PatientReport, ReportVariant


class ReportVariantInline(admin.TabularInline):
    model = ReportVariant
    extra = 1


@admin.register(PatientReport)
class PatientReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_id', 'report_date', 'test_type', 'status', 'created_at']
    list_filter = ['status', 'report_date']
    search_fields = ['patient_id', 'test_type']
    inlines = [ReportVariantInline]
    ordering = ['-report_date']


@admin.register(ReportVariant)
class ReportVariantAdmin(admin.ModelAdmin):
    list_display = ['report', 'variant', 'zygosity', 'allele_frequency', 'coverage']
    list_filter = ['zygosity']
    search_fields = ['report__patient_id', 'variant__variant_name']