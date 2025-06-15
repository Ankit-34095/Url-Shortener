package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlAnalyticsDto {
    // A distinct identifier for commit purposes (DTO for comprehensive URL analytics data)
    private Long totalClicks;
    private Long uniqueVisitors;
    private List<DailyClicksDto> dailyClicks;
    private List<ReferrerStatsDto> topReferrers;
    private List<CountryStatsDto> topCountries;
}







