package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePatientVariantReportDto {

    @JsonProperty("patient_id")
    private String patientId;

    private UUID variant;

    @JsonProperty("detection_date")
    private String detectionDate;

    @DecimalMin(value = "0.0", message = "Allele frequency must be between 0 and 1")
    @DecimalMax(value = "1.0", message = "Allele frequency must be between 0 and 1")
    @JsonProperty("allele_frequency")
    private BigDecimal alleleFrequency;
}