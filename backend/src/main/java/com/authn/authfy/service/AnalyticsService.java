package com.authn.authfy.service;

import com.authn.authfy.entity.AnalyticsResponse;
import com.authn.authfy.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ApiKeyRepository apiKeyRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public AnalyticsResponse getUserAnalytics(Long userId) {
        // 1. Fetch Key Counts from MySQL
        long totalKeys = apiKeyRepository.countByUserId(userId);
        long activeKeys = apiKeyRepository.countByUserIdAndIsActiveTrue(userId);

        // 2. Fetch Request Count from Redis
        Object reqCountObj = redisTemplate.opsForValue().get("app:total_requests");
        long totalRequests = 0;

        if (reqCountObj != null) {
            try {
                totalRequests = Long.parseLong(reqCountObj.toString());
            } catch (NumberFormatException e) {
                totalRequests = 0;
            }
        }

        // 3. Return the Combined Data
        return AnalyticsResponse.builder()
                .totalKeys(totalKeys)
                .activeKeys(activeKeys)
                .totalRequests(totalRequests)
                .successRate(99.9)
                .build();
    }
}
