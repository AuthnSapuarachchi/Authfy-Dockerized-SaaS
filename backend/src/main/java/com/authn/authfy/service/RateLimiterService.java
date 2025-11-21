package com.authn.authfy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisTemplate<String, Object> redisTemplate;

    // Configuration: 10 requests per minute
    private static final int MAX_REQUESTS = 10;
    private static final int WINDOW_SECONDS = 60;

    public boolean isRequestAllowed(String apiKeyHash) {
        String key = "rate_limit:" + apiKeyHash;

        try {
            // 1. Increment the counter
            Long count = redisTemplate.opsForValue().increment(key);

            // 2. If it's the first request (count == 1), set the expiry time
            if (count != null && count == 1) {
                redisTemplate.expire(key, WINDOW_SECONDS, TimeUnit.SECONDS);
            }

            // 3. Check if limit exceeded
            return count != null && count <= MAX_REQUESTS;

        } catch (Exception e) {
            // Fail OPEN: If Redis is down, allow the request (don't block users because of our infra failure)
            System.err.println("Redis Error: " + e.getMessage());
            return true;
        }
    }

}
