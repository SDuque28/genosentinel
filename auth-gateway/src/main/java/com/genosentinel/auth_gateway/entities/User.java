package com.genosentinel.auth_gateway.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Entidad de usuario para el sistema GenoSentinel.
 * Implementa UserDetails de Spring Security para la autenticación.
 * Rol simplificado: todos los usuarios tienen el rol "USER".
 */
@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String role = "USER"; // Rol único por defecto

    @Column(nullable = false)
    private Boolean active = true;

    /** Métodos de UserDetails **/
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retorna el rol único con el prefijo ROLE_
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {return password;}
    @Override
    public String getUsername() {return username;}

    @Override
    public boolean isAccountNonExpired() {return true;}
    @Override
    public boolean isAccountNonLocked() {return true;}
    @Override
    public boolean isCredentialsNonExpired() {return true;}
    @Override
    public boolean isEnabled() {return active;}
}
