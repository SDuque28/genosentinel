package com.genosentinel.auth_gateway.controller;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Controlador de health check para Kubernetes.
 */
@RestController
public class HealthController {

    @Operation(
            summary = "Validar estado del servicio",
            description = "Verifica si el servicio de autenticación está activo"
    )@ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Servicio activo",
                    content = @Content
            )
    })
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "auth-gateway",
                "timestamp", LocalDateTime.now()
        ));
    }
}