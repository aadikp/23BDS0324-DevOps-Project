package com.travelsphere.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Global CORS configuration for the TravelSphere API.
 *
 * <p>Allows the React frontend (running on {@code http://localhost:5173})
 * to make cross-origin requests to the Spring Boot backend on port 8080.</p>
 *
 * <p>In production, replace the allowed origin with your actual frontend URL
 * and tighten the allowed headers / methods as appropriate.</p>
 */
@Configuration
public class CorsConfig {

    /**
     * Registers a {@link CorsFilter} that runs early in the filter chain,
     * before Spring Security, ensuring pre-flight OPTIONS requests are handled
     * without requiring authentication.
     *
     * @return a configured {@link CorsFilter} bean
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ── Allowed origins ──────────────────────────────────────────────────
        // React Vite dev server (port 5173)
        // Add your production domain here when deploying, e.g.:
        //   "https://travelsphere.example.com"
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        // ── Allowed HTTP methods ──────────────────────────────────────────────
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // ── Allowed headers ───────────────────────────────────────────────────
        // "*" allows all request headers including Authorization (JWT).
        config.setAllowedHeaders(List.of("*"));

        // ── Exposed headers ───────────────────────────────────────────────────
        // Allow the client to read the Authorization header from responses.
        config.setExposedHeaders(List.of("Authorization"));

        // ── Credentials ───────────────────────────────────────────────────────
        // Must be true to allow the Axios client to send cookies or
        // Authorization headers cross-origin.
        config.setAllowCredentials(true);

        // ── Pre-flight cache ──────────────────────────────────────────────────
        // Browser caches pre-flight result for 1 hour (3600 seconds).
        config.setMaxAge(3600L);

        // Apply this configuration to every API endpoint.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
