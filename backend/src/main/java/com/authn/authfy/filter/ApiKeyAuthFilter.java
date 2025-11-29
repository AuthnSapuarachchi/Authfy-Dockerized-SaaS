package com.authn.authfy.filter;

import com.authn.authfy.entity.ApiKey;
import com.authn.authfy.repository.ApiKeyRepository;
import com.authn.authfy.service.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private final ApiKeyRepository apiKeyRepository;
    private final RateLimiterService rateLimiterService; // 1. Inject the Rate Limiter

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Get the API Key from the header "x-api-key"
        String apiKey = request.getHeader("x-api-key");

        // 2. INCREMENT GLOBAL COUNTER IF KEY IS PRESENT
        if (apiKey != null && !apiKey.isEmpty()) {
            try {
                // This creates a key "app:total_requests" in Redis and adds 1
                redisTemplate.opsForValue().increment("app:total_requests");
            } catch (Exception e) {
                // Silent fail: don't stop the request if metrics fail
                System.err.println("Metrics Error: " + e.getMessage());
            }
        }

        // 2. If no key is present, skip this filter (maybe they are logging in with user/pass)
        if (apiKey == null || apiKey.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. If key is present, validate it
        try {
            String hashedKey = hashKey(apiKey);
            Optional<ApiKey> apiKeyEntity = apiKeyRepository.findByKeyHash(hashedKey);

            if (apiKeyEntity.isPresent() && apiKeyEntity.get().getIsActive()) {

                // 2. CHECK RATE LIMIT BEFORE AUTHENTICATING 🛑
                if (!rateLimiterService.isRequestAllowed(hashedKey)) {
                    response.setStatus(429); // HTTP 429 Too Many Requests
                    response.getWriter().write("Rate limit exceeded. Try again in a minute.");
                    return; // Stop here
                }

                // Valid Key! Authenticate the request.
                ApiKey key = apiKeyEntity.get();

                // Create a "User" session for this request based on the key owner
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        key.getUser().getEmail(),
                        null,
                        Collections.emptyList()
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // Invalid or Revoked Key -> Reject immediately
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or Inactive API Key");
                return;
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
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


}
