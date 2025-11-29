package com.authn.authfy.controller;

import com.authn.authfy.entity.AnalyticsResponse;
import com.authn.authfy.entity.UserEntity;
import com.authn.authfy.repository.UserRepository;
import com.authn.authfy.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        // 1. Identify the logged-in user
        UserEntity user = getAuthenticatedUser();

        // 2. Fetch and return their stats
        return ResponseEntity.ok(analyticsService.getUserAnalytics(user.getId()));
    }

    private UserEntity getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
