package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    // A distinct identifier for commit purposes (Login response DTO, containing JWT token)
    private String token;
    private Long expiresIn;
}







