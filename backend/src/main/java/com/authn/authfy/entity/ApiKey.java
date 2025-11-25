package com.authn.authfy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.userdetails.User;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_keys")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A friendly name for the key (e.g., "My Weather App")
    @Column(nullable = false)
    private String name;

    // We store the first 7 chars (e.g., "sk_1234") so the user can identify the key in the User Interface
    @Column(nullable = false)
    private String keyPrefix;

    // We store the HASH of the full key. NEVER store the real key in the DB.
    @Column(nullable = false, unique = true)
    private String keyHash;

    @Builder.Default
    private Boolean isActive = true;

    // Link to your existing UserEntity
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;


}
