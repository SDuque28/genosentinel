package com.genosentinel.auth_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

/**
 * Servicio para la gestión de tokens JWT.
 * Genera y valida tokens de autenticación.
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration:86400000}") long expirationMillis) {
        // Decodifica la clave secreta
        byte[] keyBytes = secret.matches("^[A-Za-z0-9+/=]+$")
                ? Decoders.BASE64.decode(secret)
                : secret.getBytes();
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMillis = expirationMillis;
    }

    /**
     * Genera un token JWT para el usuario.
     * @param username nombre de usuario
     * @param role rol del usuario
     * @return token JWT
     */
    public String generateToken(String username, String role) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMillis)))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Valida y parsea un token JWT.
     * @param token token a validar
     * @return claims del token
     */
    public Claims parseToken(String token) {
        // Elimina el prefijo "Bearer " si existe
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extrae el username del token.
     * @param token token JWT
     * @return username
     */
    public String extractUsername(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * Extrae el rol del token.
     * @param token token JWT
     * @return rol del usuario
     */
    public String extractRole(String token) {
        return parseToken(token).get("role", String.class);
    }

    /**
     * Valida si el token es válido.
     * @param token token a validar
     * @return true si es válido
     */
    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
