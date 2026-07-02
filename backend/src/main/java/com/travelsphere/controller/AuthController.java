package com.travelsphere.controller;

import com.travelsphere.dto.AuthResponse;
import com.travelsphere.dto.LoginRequest;
import com.travelsphere.dto.RegisterRequest;
import com.travelsphere.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for authentication endpoints.
 *
 * <p>All routes under {@code /api/auth} are publicly accessible
 * (configured in {@link com.travelsphere.config.SecurityConfig}).</p>
 *
 * <pre>
 *   POST /api/auth/register  – Create a new account
 *   POST /api/auth/login     – Authenticate and receive a JWT
 *   GET  /api/auth/health    – Liveness check (no auth required)
 * </pre>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user account.
     *
     * @param request validated registration payload
     * @return 201 Created + {@link AuthResponse} containing the JWT
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticates an existing user.
     *
     * @param request validated login payload
     * @return 200 OK + {@link AuthResponse} containing the JWT
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Simple health-check for the auth service.
     *
     * @return 200 OK + status message
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "TravelSphere Auth API"
        ));
    }
}
