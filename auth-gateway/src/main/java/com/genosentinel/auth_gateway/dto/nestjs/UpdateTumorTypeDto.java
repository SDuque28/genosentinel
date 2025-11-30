package com.genosentinel.auth_gateway.dto.nestjs;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para actualizar un tipo de tumor")
public class UpdateTumorTypeDto {

    @Schema(description = "Nombre del tipo de tumor", example = "Melanoma Maligno")
    private String name;

    @Schema(description = "El tipo de tumor", example = "Glándulas mamarias")
    private String systemAffected;

    @Schema(description = "Descripción del tipo de tumor", example = "Cáncer de piel maligno")
    private String description;
}