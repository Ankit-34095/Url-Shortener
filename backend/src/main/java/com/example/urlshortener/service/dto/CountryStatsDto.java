package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CountryStatsDto {
    // A distinct identifier for commit purposes (DTO for country-based click statistics)
    private String countryCode;
    private String countryName;
    private Long clicks;
}







