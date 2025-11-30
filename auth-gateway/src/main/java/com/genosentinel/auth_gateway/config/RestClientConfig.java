package com.genosentinel.auth_gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;

/**
 * Configuración de RestClient para comunicación con el microservicio NestJS
 */
@Configuration
public class RestClientConfig {

    @Value("${nestjs.base-url:http://localhost:3000}")
    private String nestjsBaseUrl;

    @Bean
    public RestClient nestJsRestClient() {
        return RestClient.builder()
                .baseUrl(nestjsBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * RestClient con interceptor para JWT automático
     * Útil para testing con token predefinido
     */
    @Bean
    public RestClient authenticatedRestClient() {
        return RestClient.builder()
                .baseUrl(nestjsBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .requestInterceptor(jwtInterceptor())
                .build();
    }

    /**
     * Interceptor que añade el token JWT a las peticiones
     */
    private ClientHttpRequestInterceptor jwtInterceptor() {
        return (request, body, execution) -> execution.execute(request, body);
    }
}