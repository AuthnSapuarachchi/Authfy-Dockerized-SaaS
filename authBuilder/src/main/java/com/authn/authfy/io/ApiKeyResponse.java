package com.authn.authfy.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiKeyResponse {
    private Long id;
    private String name;
    private String keyPrefix;
    private String rawKey; // This will be NULL except right after creation
    private Boolean isActive;
    private Timestamp createdAt;
}
