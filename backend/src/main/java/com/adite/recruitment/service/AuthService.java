package com.adite.recruitment.service;

import com.adite.recruitment.entity.User;
import com.adite.recruitment.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String name, String email, String password, String role) {
        String normalizedRole = normalizeRole(role);
        userRepository.findByEmail(email).ifPresent(existing -> {
            throw new RuntimeException("Email already registered.");
        });

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(normalizedRole);
        return userRepository.save(user);
    }

    public Map<String, Object> login(String email, String password, String role) {
        String normalizedRole = normalizeRole(role);
        User user = userRepository.findByEmailAndRole(email, normalizedRole)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return Map.of(
                "success", true,
                "message", "Login successful",
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Role is required");
        }
        String normalized = role.trim().toUpperCase(Locale.ROOT);
        if (!normalized.equals("HR") && !normalized.equals("CANDIDATE") && !normalized.equals("INTERVIEWER")) {
            throw new RuntimeException("Role must be HR, CANDIDATE or INTERVIEWER");
        }
        return normalized;
    }
}
