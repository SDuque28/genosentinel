package com.genosentinel.auth_gateway.controller;

import com.genosentinel.auth_gateway.dto.AuthResponse;
import com.genosentinel.auth_gateway.dto.LoginRequest;
import com.genosentinel.auth_gateway.dto.RegisterRequest;
import com.genosentinel.auth_gateway.entities.User;
import com.genosentinel.auth_gateway.repository.UserRepository;
import com.genosentinel.auth_gateway.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Controlador de autenticación.
 * Gestiona login, registro y validación de usuarios.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Endpoint de login.
     * @param request credenciales de usuario
     * @return token JWT y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Auténtica las credenciales (esto valida username Y password)
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials");
        }
        // Obtiene el usuario autenticado
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        // Genera el token JWT
        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        // Construye la respuesta
        AuthResponse response = new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint de registro.
     * @param request datos del nuevo usuario
     * @return token JWT y datos del usuario creado
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

        // Valida que no exista el username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username already exists");
        }

        // Crea el nuevo usuario
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER"); // Rol por defecto
        user.setActive(true);

        // Guarda en la base de datos
        userRepository.save(user);

        // Genera el token JWT
        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        // Construye la respuesta
        AuthResponse response = new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint para validar token (útil para el gateway).
     * @param authHeader header de autorización
     * @return información del usuario si el token es válido
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, String>> validateToken(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or missing token");
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid token");
        }

        String username = jwtService.extractUsername(token);
        String role = jwtService.extractRole(token);

        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role,
                "valid", "true"
        ));
    }

    /**
     * Manejo de errores de autenticación.
     */
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleAuthenticationException(Exception e) {
        return Map.of("error", "Invalid credentials");
    }
}