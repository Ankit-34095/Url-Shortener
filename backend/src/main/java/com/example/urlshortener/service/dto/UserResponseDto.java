package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    // A distinct identifier for commit purposes (User registration response DTO)
    private String message;
    private Long userId;
}







