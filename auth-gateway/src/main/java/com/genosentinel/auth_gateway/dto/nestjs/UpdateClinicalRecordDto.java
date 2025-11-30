package com.genosentinel.auth_gateway.dto.nestjs;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para actualizar una historia clínica")
public class UpdateClinicalRecordDto {

    @JsonProperty("patientId")
    @Schema(description = "ID del paciente", example = "1")
    private Integer patientId;

    @JsonProperty("tumorTypeId")
    @Schema(description = "ID del tipo de tumor", example = "1")
    private Integer tumorTypeId;

    @NotNull(message = "La fecha de diagnóstico es obligatoria")
    @Schema(description = "Fecha del diagnóstico en formato AAAA-MM-DD", example = "2024-06-15")
    private String diagnosisDate;

    @Schema(description = "Diagnóstico médico", example = "Melanoma en estadio II")
    private String diagnosis;

    @Schema(description = "Estado del cancer ", example = "IIB")
    private String stage;

    @Schema(description = "Tratamiento prescrito", example = "Cirugía + radioterapia + quimioterapia")
    private String treatmentProtocol;

    @Schema(description = "Notas adicionales", example = "Evolución favorable")
    private String evolutionNotes;
}