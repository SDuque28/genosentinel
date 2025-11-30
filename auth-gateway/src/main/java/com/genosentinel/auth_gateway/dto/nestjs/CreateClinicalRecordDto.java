package com.genosentinel.auth_gateway.dto.nestjs;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear una historia clínica")
public class CreateClinicalRecordDto {

    @NotNull(message = "El ID del paciente es obligatorio")
    @Positive(message = "El ID del paciente debe ser positivo")
    @JsonProperty("patientId")
    @Schema(description = "ID del paciente", example = "1")
    private Integer patientId;

    @NotNull(message = "El ID del tipo de tumor es obligatorio")
    @Positive(message = "El ID del tipo de tumor debe ser positivo")
    @JsonProperty("tumorTypeId")
    @Schema(description = "ID del tipo de tumor", example = "1")
    private Integer tumorTypeId;

    @NotNull(message = "La fecha de diagnóstico es obligatoria")
    @Schema(description = "Fecha del diagnóstico en formato AAAA-MM-DD", example = "2024-06-15")
    private String diagnosisDate;

    @NotBlank(message = "El diagnóstico es obligatorio")
    @Schema(description = "Diagnóstico médico", example = "Melanoma en estadio I")
    private String diagnosis;

    @Schema(description = "Estado del cancer ", example = "IIB")
    private String stage;

    @Schema(description = "Protocola de tratamiento", example = "Quimioterapia AC-T (4 ciclos Adriamicina + Ciclofosfamida, 4 ciclos Taxol) + Radioterapia")
    private String treatmentProtocol;

    @Schema(description = "Notas de evolución", example = "El paciente ha respondido bien al tratamiento inicial.")
    private String evolutionNotes;
}