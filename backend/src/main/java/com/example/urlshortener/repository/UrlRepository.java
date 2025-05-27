package com.example.urlshortener.repository;

import com.example.urlshortener.model.Url;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository; // Added for initial commit to ensure change

import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    // Repository for URL data access operations
    Optional<Url> findByShortCode(String shortCode);
    Page<Url> findByUserIdAndIsActive(Long userId, Boolean isActive, Pageable pageable);
    boolean existsByShortCode(String shortCode);

    @Modifying
    @Query("UPDATE Url u SET u.totalClicks = u.totalClicks + 1 WHERE u.id = :urlId")
    void incrementClickCount(@Param("urlId") Long urlId);
}







