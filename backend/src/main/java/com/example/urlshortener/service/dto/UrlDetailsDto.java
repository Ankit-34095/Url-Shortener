package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlDetailsDto {
    // A distinct identifier for commit purposes (DTO for detailed URL information)
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String title;
    private String description;
    private Long totalClicks;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Boolean isActive; // New field for active status
    // private UserDto user; // Optionally include user details if needed
}







