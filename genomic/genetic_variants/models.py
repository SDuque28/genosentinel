import uuid
from django.db import models
from genes.models import Gene


class GeneticVariant(models.Model):
    """
    Genetic variant/mutation
    """
    IMPACT_CHOICES = [
        ('MISSENSE', 'Missense'),
        ('NONSENSE', 'Nonsense'),
        ('FRAMESHIFT', 'Frameshift'),
        ('SILENT', 'Silent'),
        ('SPLICE_SITE', 'Splice Site'),
        ('INFRAME_INSERTION', 'Inframe Insertion'),
        ('INFRAME_DELETION', 'Inframe Deletion'),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    gene = models.ForeignKey(
        Gene,
        on_delete=models.CASCADE,
        related_name='variants',
        help_text='Associated gene'
    )
    chromosome = models.CharField(
        max_length=10,
        help_text='Chromosome (e.g., chr17)'
    )
    position = models.BigIntegerField(
        help_text='Position on chromosome'
    )
    reference_base = models.CharField(
        max_length=500,
        help_text='Reference base(s) (e.g., A)'
    )
    alternate_base = models.CharField(
        max_length=500,
        help_text='Alternate base(s) (e.g., G)'
    )
    impact = models.CharField(
        max_length=30,
        choices=IMPACT_CHOICES,
        help_text='Variant impact type'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'genetic_variants'
        ordering = ['chromosome', 'position']

    def __str__(self):
        return f"{self.gene.symbol} - {self.chromosome}:{self.position}"