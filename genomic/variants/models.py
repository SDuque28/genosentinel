from django.db import models
from django.core.validators import RegexValidator
from genes.models import Gene


class Variant(models.Model):
    """
    Model for genetic variants/mutations
    """
    VARIANT_TYPE_CHOICES = [
        ('SNV', 'Single Nucleotide Variant'),
        ('INSERTION', 'Insertion'),
        ('DELETION', 'Deletion'),
        ('INDEL', 'Insertion-Deletion'),
        ('CNV', 'Copy Number Variant'),
        ('FUSION', 'Gene Fusion'),
    ]

    CLINICAL_SIGNIFICANCE_CHOICES = [
        ('PATHOGENIC', 'Pathogenic'),
        ('LIKELY_PATHOGENIC', 'Likely Pathogenic'),
        ('UNCERTAIN', 'Uncertain Significance'),
        ('LIKELY_BENIGN', 'Likely Benign'),
        ('BENIGN', 'Benign'),
    ]

    gene = models.ForeignKey(
        Gene,
        on_delete=models.CASCADE,
        related_name='variants',
        help_text='Associated gene'
    )
    variant_name = models.CharField(
        max_length=100,
        help_text='Variant nomenclature (e.g., c.2573T>G, p.Leu858Arg)'
    )
    variant_type = models.CharField(
        max_length=20,
        choices=VARIANT_TYPE_CHOICES,
        help_text='Type of genetic variant'
    )
    chromosome_position = models.CharField(
        max_length=50,
        help_text='Chromosomal position (e.g., chr17:41234470)'
    )
    reference_allele = models.CharField(
        max_length=500,
        help_text='Reference nucleotide sequence'
    )
    alternate_allele = models.CharField(
        max_length=500,
        help_text='Alternate nucleotide sequence'
    )
    clinical_significance = models.CharField(
        max_length=20,
        choices=CLINICAL_SIGNIFICANCE_CHOICES,
        help_text='Clinical significance classification'
    )
    effect_description = models.TextField(
        help_text='Description of the variant effect'
    )
    dbsnp_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        validators=[RegexValidator(
            regex=r'^rs\d+$',
            message='dbSNP ID must start with "rs" followed by numbers'
        )],
        help_text='dbSNP identifier (e.g., rs121913227)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'variants'
        ordering = ['gene__gene_symbol', 'variant_name']
        verbose_name = 'Variant'
        verbose_name_plural = 'Variants'
        unique_together = ['gene', 'variant_name']

    def __str__(self):
        return f"{self.gene.gene_symbol} - {self.variant_name}"