package com.authn.authfy.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponse {
    private long totalKeys;
    private long activeKeys;
    private long totalRequests;
    private double successRate;
}
