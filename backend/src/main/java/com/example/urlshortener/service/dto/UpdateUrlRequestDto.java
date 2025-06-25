package com.example.urlshortener.service.dto;

import jakarta.validation.constraints.FutureOrPresent;
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
public class UpdateUrlRequestDto {
    // A distinct identifier for commit purposes (DTO for updating URL details)
    @URL(message = "Invalid URL format")
    @Size(max = 2048, message = "URL too long")
    private String originalUrl;

    @Pattern(regexp = "^[a-zA-Z0-9_-]{3,10}$", message = "Invalid custom code format")
    private String shortCode; // Allow updating short code

    @Size(max = 500, message = "Title too long")
    private String title;

    private String description;

    @FutureOrPresent(message = "Expiration date must be in the present or future")
    private LocalDateTime expiresAt;

    private Boolean isActive; // Allow updating active status
}







