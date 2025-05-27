package com.example.urlshortener.repository;

import com.example.urlshortener.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository; // Added for initial commit to ensure change

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Repository for User data access operations
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}







