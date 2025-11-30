package com.genosentinel.auth_gateway.dto.nestjs;

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
@Schema(description = "Datos para crear un paciente")
public class CreatePatientDto {

    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre completo del paciente", example = "Juan Pérez")
    private String firstName;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Schema(description = "Apellidos del paciente", example = "García López")
    private String lastName;

    @NotBlank(message = "La fecha de nacimiento es obligatoria")
    @Schema(description = "Fecha de nacimiento del paciente en formato AAAA-MM-DD", example = "1980-05-15")
    private String birthDate;

    @NotBlank(message = "El género es obligatorio")
    @Schema(description = "Género del paciente", example = "M", allowableValues = {"M", "F", "Otro"})
    private String gender;

    @NotBlank(message = "El estado es obligatorio")
    @Schema(description = "Estado del paciente", example = "Activo", allowableValues = {"Activo", "Inactivo"})
    private String status;
}