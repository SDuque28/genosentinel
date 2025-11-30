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
 * Configuración de RestClient con manejo de errores simplificado
 */
@Slf4j
@Configuration
public class RestClientConfig {

    @Value("${nestjs.base-url:http://localhost:3000}")
    private String nestjsBaseUrl;

    @Bean
    public RestClient nestJsRestClient() {
        return RestClient.builder()
                .baseUrl(nestjsBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                // Manejo de errores 4xx (400, 404, 409, etc.)
                .defaultStatusHandler(
                        HttpStatusCode::is4xxClientError,
                        (request, response) -> {
                            String body = readBody(response);
                            String message = extractMessage(body);

                            log.error("Error 4xx from NestJS [{}]: {}",
                                    response.getStatusCode(), message);

                            throw new ResponseStatusException(
                                    response.getStatusCode(),
                                    message
                            );
                        }
                )
                // Manejo de errores 5xx (500, 502, 503, etc.)
                .defaultStatusHandler(
                        HttpStatusCode::is5xxServerError,
                        (request, response) -> {
                            String body = readBody(response);

                            log.error("Error 5xx from NestJS [{}]: {}",
                                    response.getStatusCode(), body);

                            throw new ResponseStatusException(
                                    response.getStatusCode(),
                                    "Error en el servidor de NestJS"
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
     * Extrae el mensaje de error del JSON de NestJS
     * Formato típico: {"message":"Error message","error":"Not Found","statusCode":404}
     */
    private String extractMessage(String jsonBody) {
        try {
            // Busca el campo "message" en el JSON
            if (jsonBody.contains("\"message\"")) {
                int start = jsonBody.indexOf("\"message\"") + 10;
                int colon = jsonBody.indexOf(":", start);
                int firstQuote = jsonBody.indexOf("\"", colon) + 1;
                int secondQuote = jsonBody.indexOf("\"", firstQuote);

                if (firstQuote > 0 && secondQuote > firstQuote) {
                    return jsonBody.substring(firstQuote, secondQuote);
                }
            }

            // Si no puede extraer el mensaje, devuelve el body completo
            return jsonBody.length() > 200
                    ? jsonBody.substring(0, 200) + "..."
                    : jsonBody;

        } catch (Exception e) {
            log.warn("Could not parse error message from: {}", jsonBody);
            return "Error en la petición al microservicio";
        }
    }
}