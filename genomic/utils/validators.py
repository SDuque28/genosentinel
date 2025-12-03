from rest_framework import serializers


def validate_allele_frequency(value):
    """Validate allele frequency is between 0 and 1"""
    if value < 0 or value > 1:
        raise serializers.ValidationError(
            "Allele frequency must be between 0 and 1"
        )
    return value


def validate_coverage(value):
    """Validate coverage is positive"""
    if value < 0:
        raise serializers.ValidationError(
            "Coverage must be a positive number"
        )
    return value