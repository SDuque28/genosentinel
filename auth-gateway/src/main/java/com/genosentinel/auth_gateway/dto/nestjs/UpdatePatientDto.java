package com.genosentinel.auth_gateway.dto.nestjs;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para actualizar un paciente")
public class UpdatePatientDto {

    @Schema(description = "Nombre completo del paciente", example = "Juan Pérez")
    private String firstName;

    @Schema(description = "Apellido del paciente", example = "García")
    private String lastName;

    @Schema(description = "Fecha de nacimiento del paciente", example = "1978-11-23")
    private String birthDate;

    @Schema(description = "Género del paciente", example = "M")
    private String gender;
}