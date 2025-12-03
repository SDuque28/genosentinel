package com.genosentinel.auth_gateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

/**
 * Configuración de RestClient para Django Genomic Microservice
 */
@Slf4j
@Configuration
public class DjangoRestClientConfig {

    @Value("${django.genomic.base-url:http://localhost:8000}")
    private String djangoBaseUrl;

    @Bean
    public RestClient djangoGenomicRestClient() {
        return RestClient.builder()
                .baseUrl(djangoBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                // Manejo de errores 4xx
                .defaultStatusHandler(
                        HttpStatusCode::is4xxClientError,
                        (request, response) -> {
                            String body = readBody(response);
                            String message = extractDjangoMessage(body);

                            log.error("Error 4xx from Django [{}]: {}",
                                    response.getStatusCode(), message);

                            throw new ResponseStatusException(
                                    response.getStatusCode(),
                                    message
                            );
                        }
                )
                // Manejo de errores 5xx
                .defaultStatusHandler(
                        HttpStatusCode::is5xxServerError,
                        (request, response) -> {
                            String body = readBody(response);

                            log.error("Error 5xx from Django [{}]: {}",
                                    response.getStatusCode(), body);

                            throw new ResponseStatusException(
                                    response.getStatusCode(),
                                    "Error en el servidor de Django Genomic"
                            );
                        }
                )
                .build();
    }

    /**
     * Lee el cuerpo de la respuesta de error
     */
    private String readBody(org.springframework.http.client.ClientHttpResponse response) {
        try {
            return new String(response.getBody().readAllBytes());
        } catch (IOException e) {
            log.warn("Could not read error response body", e);
            return "Error reading response";
        }
    }

    /**
     * Extrae el mensaje de error del JSON de Django REST Framework
     * Formato típico: {"detail":"Error message"} o {"field_name":["Error message"]}
     */
    private String extractDjangoMessage(String jsonBody) {
        try {
            // Busca el campo "detail" primero (errores generales)
            if (jsonBody.contains("\"detail\"")) {
                int start = jsonBody.indexOf("\"detail\"") + 9;
                int colon = jsonBody.indexOf(":", start);
                int firstQuote = jsonBody.indexOf("\"", colon) + 1;
                int secondQuote = jsonBody.indexOf("\"", firstQuote);

                if (firstQuote > 0 && secondQuote > firstQuote) {
                    return jsonBody.substring(firstQuote, secondQuote);
                }
            }

            // Si no hay "detail", devuelve el body completo (puede ser errores de validación)
            return jsonBody.length() > 200
                    ? jsonBody.substring(0, 200) + "..."
                    : jsonBody;

        } catch (Exception e) {
            log.warn("Could not parse error message from: {}", jsonBody);
            return "Error en la petición al microservicio Django";
        }
    }
}