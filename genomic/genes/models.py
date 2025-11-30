from django.db import models
from django.core.validators import RegexValidator


class Gene(models.Model):
    """
    Model for cataloging genes of oncological interest
    """
    gene_symbol = models.CharField(
        max_length=50,
        unique=True,
        validators=[RegexValidator(
            regex=r'^[A-Z0-9-]+$',
            message='Gene symbol must contain only uppercase letters, numbers, and hyphens'
        )],
        help_text='Official gene symbol (e.g., BRCA1, TP53)'
    )
    gene_name = models.CharField(
        max_length=255,
        help_text='Full gene name'
    )
    chromosome = models.CharField(
        max_length=10,
        help_text='Chromosome location (e.g., 17, X, Y)'
    )
    function = models.TextField(
        help_text='Gene function description'
    )
    oncological_relevance = models.TextField(
        help_text='Relevance in oncology'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'genes'
        ordering = ['gene_symbol']
        verbose_name = 'Gene'
        verbose_name_plural = 'Genes'

    def __str__(self):
        return f"{self.gene_symbol} - {self.gene_name}"