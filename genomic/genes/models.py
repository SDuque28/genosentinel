from django.db import models


class Gene(models.Model):
    """
    Gene catalog
    """
    symbol = models.CharField(
        max_length=50,
        unique=True,
        help_text='Gene symbol (e.g., BRCA1)'
    )
    full_name = models.CharField(
        max_length=255,
        help_text='Full gene name'
    )
    function_summary = models.TextField(
        help_text='Summary of gene function'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'genes'
        ordering = ['symbol']

    def __str__(self):
        return self.symbol