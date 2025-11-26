package com.genosentinel.auth_gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de autenticación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String email;
    private String role;

    public AuthResponse(String accessToken, String username, String email, String role) {
        this.accessToken = accessToken;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
