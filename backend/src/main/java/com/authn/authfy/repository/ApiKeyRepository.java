package com.authn.authfy.repository;

import com.authn.authfy.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    // 1. Find all keys belonging to a specific user (to show in Dashboard)
    List<ApiKey> findByUserId(Long userId);

    // 2. Find a specific key by its ID and User ID (Security check: ensure user owns the key)
    Optional<ApiKey> findByIdAndUserId(Long id, Long userId);

    // 3. Find a key by its Hashed value (Used when validating API requests)
    Optional<ApiKey> findByKeyHash(String keyHash);

}
