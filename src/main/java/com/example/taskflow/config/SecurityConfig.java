package com.example.taskflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Desactiva CSRF para poder hacer POST desde HTML
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()    // Permite acceso a todos los endpoints
                );

        return http.build();
    }
}
