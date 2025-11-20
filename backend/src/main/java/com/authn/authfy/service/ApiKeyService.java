package com.authn.authfy.service;

import com.authn.authfy.entity.ApiKey;
import com.authn.authfy.entity.UserEntity;
import com.authn.authfy.io.ApiKeyResponse;
import com.authn.authfy.repository.ApiKeyRepository;
import com.authn.authfy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    // We use SecureRandom for generating the secret key (Not just generic Random)
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates a new API Key for a User.
     * Format: sk_live_ + 32 random chars
     */
    public ApiKeyResponse createApiKey(Long userId, String keyName) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Generate the Raw Key (The secret)
        String rawKey = "sk_live_" + generateRandomString(32);

        // 2. Hash the key for storage (SHA-256)
        String hashedKey = hashKey(rawKey);

        // 3. Create the Entity
        ApiKey apiKey = ApiKey.builder()
                .name(keyName)
                .user(user)
                .keyPrefix(rawKey.substring(0, 15) + "...") // Store first 15 chars for display
                .keyHash(hashedKey)
                .isActive(true)
                .build();

        // 4. Save to DB
        ApiKey savedKey = apiKeyRepository.save(apiKey);

        // 5. Return the response (Including the RAW key so user can copy it)
        return mapToResponse(savedKey, rawKey);
    }

    /**
     * Get all keys for a user (To list in dashboard)
     * Note: We DO NOT return the rawKey here, because we don't have it!
     */
    public List<ApiKeyResponse> getUserApiKeys(Long userId) {
        return apiKeyRepository.findByUserId(userId).stream()
                .map(key -> mapToResponse(key, null))
                .collect(Collectors.toList());
    }

    /**
     * Revoke (Delete/Deactivate) a key
     */
    public void revokeApiKey(Long userId, Long keyId) {
        ApiKey key = apiKeyRepository.findByIdAndUserId(keyId, userId)
                .orElseThrow(() -> new RuntimeException("Key not found or access denied"));

        key.setIsActive(false);
        apiKeyRepository.save(key);
    }

    // --- Helper Methods ---

    private String generateRandomString(int length) {
        byte[] bytes = new byte[length];
        secureRandom.nextBytes(bytes);
        // URL-safe Base64 encoding to make it string-friendly
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
                .substring(0, length);
    }

    private String hashKey(String key) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(key.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing API key", e);
        }
    }

    private ApiKeyResponse mapToResponse(ApiKey entity, String rawKey) {
        return ApiKeyResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .keyPrefix(entity.getKeyPrefix())
                .rawKey(rawKey) // Will be null if we are just listing keys
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

}
