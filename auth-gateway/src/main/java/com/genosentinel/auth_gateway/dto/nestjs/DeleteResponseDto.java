package com.genosentinel.auth_gateway.dto.nestjs;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta de eliminación")
public class DeleteResponseDto {

    @Schema(description = "Mensaje de confirmación", example = "Registro eliminado exitosamente")
    private String message;

    @Schema(description = "ID del registro eliminado", example = "1")
    private Integer id;
}