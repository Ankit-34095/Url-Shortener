package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlResponseDto {
    // A distinct identifier for commit purposes (DTO for returning shortened URL details)
    private String shortCode;
    private String shortUrl;
    private String originalUrl;
}







