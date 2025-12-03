import uuid
from django.db import models
from genetic_variants.models import GeneticVariant


class PatientVariantReport(models.Model):
    """
    Patient variant detection report
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    patient_id = models.CharField(
        max_length=50,
        help_text='Patient ID from Clinical Microservice'
    )
    variant = models.ForeignKey(
        GeneticVariant,
        on_delete=models.CASCADE,
        related_name='patient_reports',
        help_text='Detected variant'
    )
    detection_date = models.DateField(
        help_text='Date variant was detected'
    )
    allele_frequency = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        help_text='Variant Allele Frequency (VAF) - 0.0 to 1.0'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'patient_variant_reports'
        ordering = ['-detection_date']

    def __str__(self):
        return f"Patient {self.patient_id} - {self.variant}"