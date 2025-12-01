package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientVariantReportDto {
    private UUID id;

    @JsonProperty("patient_id")
    private String patientId;

    @JsonProperty("patient_data")
    private PatientDataDto patientData;

    private UUID variant;

    @JsonProperty("variant_details")
    private GeneticVariantDto variantDetails;

    @JsonProperty("detection_date")
    private LocalDate detectionDate;

    @JsonProperty("allele_frequency")
    private BigDecimal alleleFrequency;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;
}