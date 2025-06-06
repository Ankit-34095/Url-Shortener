package com.example.urlshortener.controller;

import com.example.urlshortener.service.AnalyticsService;
import com.example.urlshortener.service.AuthService;
import com.example.urlshortener.service.dto.UrlAnalyticsDto;
import com.example.urlshortener.service.dto.DailyClicksDto;
import com.example.urlshortener.service.dto.ReferrerStatsDto;
import com.example.urlshortener.service.dto.CountryStatsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{shortCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UrlAnalyticsDto> getUrlAnalytics(@PathVariable String shortCode) {
        Long userId = authService.getCurrentUser().getId();
        UrlAnalyticsDto analytics = analyticsService.getUrlAnalytics(shortCode, userId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/{shortCode}/daily-clicks")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DailyClicksDto>> getDailyClicks(@PathVariable String shortCode) {
        Long userId = authService.getCurrentUser().getId();
        List<DailyClicksDto> dailyClicks = analyticsService.getDailyClickStats(shortCode, userId);
        return ResponseEntity.ok(dailyClicks);
    }

    @GetMapping("/{shortCode}/referrers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReferrerStatsDto>> getTopReferrers(
            @PathVariable String shortCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = authService.getCurrentUser().getId();
        Pageable pageable = PageRequest.of(page, size);
        List<ReferrerStatsDto> referrers = analyticsService.getTopReferrers(shortCode, userId, pageable);
        return ResponseEntity.ok(referrers);
    }

    @GetMapping("/{shortCode}/countries")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CountryStatsDto>> getTopCountries(
            @PathVariable String shortCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = authService.getCurrentUser().getId();
        Pageable pageable = PageRequest.of(page, size);
        List<CountryStatsDto> countries = analyticsService.getTopCountries(shortCode, userId, pageable);
        return ResponseEntity.ok(countries);
    }
}







