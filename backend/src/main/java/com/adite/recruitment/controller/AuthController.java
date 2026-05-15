package com.adite.recruitment.controller;

import com.adite.recruitment.service.AuthService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> loginHelp() {
        return ResponseEntity.ok(Map.of(
                "message", "Use POST /api/login for API login, or open /login.html for UI login page."
        ));
    }

    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request.email(), request.password(), request.role()));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PostMapping("/api/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        authService.register(request.name(), request.email(), request.password(), request.role());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Registration successful. Please login."));
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password,
            @NotBlank String role
    ) {
    }

    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank String password,
            @NotBlank String role
    ) {
    }
}
