package com.travelsphere.service;

import com.travelsphere.dto.AuthResponse;
import com.travelsphere.dto.LoginRequest;
import com.travelsphere.dto.RegisterRequest;
import com.travelsphere.model.User;
import com.travelsphere.repository.UserRepository;
import com.travelsphere.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Business logic for registration and login.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository      userRepository;
    private final PasswordEncoder     passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider    jwtTokenProvider;

    /**
     * Registers a new user.
     *
     * @param request registration payload
     * @return {@link AuthResponse} with a freshly issued JWT
     * @throws IllegalArgumentException if username or email is already taken
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "An account with email '" + request.getEmail() + "' already exists.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .build();

        userRepository.save(user);
        log.info("Registered new user: {}", user.getUsername());

        String token = jwtTokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .accessToken(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();
    }

    /**
     * Authenticates an existing user and returns a JWT.
     *
     * @param request login payload
     * @return {@link AuthResponse} with a freshly issued JWT
     */
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        String token = jwtTokenProvider.generateToken(authentication);
        User user = (User) authentication.getPrincipal();

        log.info("User '{}' authenticated successfully", user.getUsername());

        return AuthResponse.builder()
                .accessToken(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();
    }
}
