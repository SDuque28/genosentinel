package com.genosentinel.auth_gateway.dto.nestjs;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Información completa de una historia clínica")
public class ClinicalRecordDto {

    @Schema(description = "ID único de la historia clínica", example = "1")
    private Integer id;

    @Schema(description = "Diagnóstico médico", example = "Melanoma en estadio I")
    private String diagnosis;

    @Schema(description = "Tratamiento prescrito", example = "Cirugía + quimioterapia")
    private String treatmentProtocol;

    @Schema(description = "Fecha del diagnóstico", example = "2024-06-15T14:30:00")
    private String diagnosisDate;

    @Schema(description = "Notas adicionales")
    private String evolutionNotes;

    @Schema(description = "Información del paciente")
    private PatientResponseDto patient;

    @JsonProperty("tumorType")
    @Schema(description = "Información del tipo de tumor")
    private TumorTypeDto tumorType;
}