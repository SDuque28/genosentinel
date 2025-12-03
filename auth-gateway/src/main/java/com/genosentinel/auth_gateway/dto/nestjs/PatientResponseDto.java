package com.genosentinel.auth_gateway.dto.nestjs;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta con información del paciente")
public class PatientResponseDto {

    @Schema(description = "ID único del paciente", example = "1")
    private Integer id;

    @Schema(description = "Nombre completo del paciente", example = "Juan Pérez")
    private String firstName;

    @Schema(description = "Apellido del paciente", example = "García")
    private String lastName;

    @Schema(description = "Fecha de nacimiento del paciente", example = "1980-05-15")
    private String birthDate;

    @Schema(description = "Género del paciente", example = "M")
    private String gender;

    @Schema(description = "Estado del paciente", example = "Activo")
    private String status;
}