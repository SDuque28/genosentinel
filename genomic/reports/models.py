from django.db import models
from variants.models import Variant


class PatientReport(models.Model):
    """
    Model for patient genetic reports
    """
    REPORT_STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('IN_REVIEW', 'In Review'),
        ('COMPLETED', 'Completed'),
        ('AMENDED', 'Amended'),
    ]

    patient_id = models.CharField(
        max_length=50,
        help_text='Patient identifier from Clinical Microservice'
    )
    report_date = models.DateField(
        help_text='Date of the report'
    )
    test_type = models.CharField(
        max_length=100,
        help_text='Type of genetic test performed'
    )
    status = models.CharField(
        max_length=20,
        choices=REPORT_STATUS_CHOICES,
        default='DRAFT',
        help_text='Report status'
    )
    clinical_notes = models.TextField(
        blank=True,
        help_text='Additional clinical observations'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'patient_reports'
        ordering = ['-report_date']
        verbose_name = 'Patient Report'
        verbose_name_plural = 'Patient Reports'

    def __str__(self):
        return f"Report {self.id} - Patient {self.patient_id}"


class ReportVariant(models.Model):
    """
    Model for linking variants to patient reports
    """
    report = models.ForeignKey(
        PatientReport,
        on_delete=models.CASCADE,
        related_name='report_variants',
        help_text='Associated report'
    )
    variant = models.ForeignKey(
        Variant,
        on_delete=models.CASCADE,
        related_name='variant_reports',
        help_text='Detected variant'
    )
    zygosity = models.CharField(
        max_length=20,
        choices=[
            ('HETEROZYGOUS', 'Heterozygous'),
            ('HOMOZYGOUS', 'Homozygous'),
            ('HEMIZYGOUS', 'Hemizygous'),
        ],
        help_text='Zygosity status'
    )
    allele_frequency = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        help_text='Variant allele frequency (0.0 to 1.0)'
    )
    coverage = models.IntegerField(
        help_text='Sequencing coverage depth'
    )
    interpretation = models.TextField(
        help_text='Clinical interpretation of this variant for this patient'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'report_variants'
        ordering = ['report', 'variant']
        verbose_name = 'Report Variant'
        verbose_name_plural = 'Report Variants'
        unique_together = ['report', 'variant']

    def __str__(self):
        return f"{self.report} - {self.variant}"