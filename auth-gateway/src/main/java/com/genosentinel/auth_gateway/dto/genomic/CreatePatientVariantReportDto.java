package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreatePatientVariantReportDto {

    @NotBlank(message = "Patient ID is required")
    @JsonProperty("patient_id")
    private String patientId;

    @NotNull(message = "Variant is required")
    private UUID variant;

    @NotNull(message = "Detection date is required")
    @JsonProperty("detection_date")
    private LocalDate detectionDate;

    @NotNull(message = "Allele frequency is required")
    @DecimalMin(value = "0.0", message = "Allele frequency must be between 0 and 1")
    @DecimalMax(value = "1.0", message = "Allele frequency must be between 0 and 1")
    @JsonProperty("allele_frequency")
    private BigDecimal alleleFrequency;
}