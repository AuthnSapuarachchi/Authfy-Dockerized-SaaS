package com.authn.authfy.controller;

import com.authn.authfy.entity.UserEntity;
import com.authn.authfy.io.ApiKeyResponse;
import com.authn.authfy.repository.UserRepository;
import com.authn.authfy.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;
    private final UserRepository userRepository;

    /**
     * Create a new API Key
     * Request Body: { "name": "My App Name" }
     */
    @PostMapping
    public ResponseEntity<ApiKeyResponse> createApiKey(@RequestBody Map<String, String> request) {
        UserEntity user = getAuthenticatedUser();
        String name = request.get("name");

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Key name is required");
        }

        ApiKeyResponse response = apiKeyService.createApiKey(user.getId(), name);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all keys for the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<ApiKeyResponse>> getUserApiKeys() {
        UserEntity user = getAuthenticatedUser();
        List<ApiKeyResponse> keys = apiKeyService.getUserApiKeys(user.getId());
        return ResponseEntity.ok(keys);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revokeApiKey(@PathVariable Long id) {
        UserEntity user = getAuthenticatedUser();
        apiKeyService.revokeApiKey(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    // --- Helper to get current user from Spring Security ---
    private UserEntity getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Assuming email is the username

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

}
