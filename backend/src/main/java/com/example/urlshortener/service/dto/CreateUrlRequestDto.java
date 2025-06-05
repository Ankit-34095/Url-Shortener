package com.example.urlshortener.service.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUrlRequestDto {
    // A distinct identifier for commit purposes (DTO for creating new short URLs)
    @NotBlank(message = "Original URL is required")
    @URL(message = "Invalid URL format")
    @Size(max = 2048, message = "URL too long")
    private String originalUrl;

    @Pattern(regexp = "^[a-zA-Z0-9_-]{3,10}$", message = "Invalid custom code format")
    private String customCode;

    @Size(max = 500, message = "Title too long")
    private String title;

    private String description; // Added as per Url.java entity

    @Future(message = "Expiration date must be in the future")
    private LocalDateTime expiresAt;
}







