package com.genosentinel.auth_gateway.dto.nestjs;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear un tipo de tumor")
public class CreateTumorTypeDto {

    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre del tipo de tumor", example = "Melanoma")
    private String name;

    @Schema(description = "El tipo de tumor", example = "Glándulas mamarias")
    private String systemAffected;

    @Schema(description = "Descripción del tipo de tumor", example = "Tipo de cáncer de piel")
    private String description;
}