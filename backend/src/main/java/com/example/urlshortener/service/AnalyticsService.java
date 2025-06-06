package com.example.urlshortener.service;

import com.example.urlshortener.exception.UnauthorizedAccessException;
import com.example.urlshortener.exception.UrlNotFoundException;
import com.example.urlshortener.model.Url;
import com.example.urlshortener.repository.ClickRepository;
import com.example.urlshortener.repository.UrlRepository;
import com.example.urlshortener.service.dto.UrlAnalyticsDto;
import com.example.urlshortener.service.dto.DailyClicksDto;
import com.example.urlshortener.service.dto.ReferrerStatsDto;
import com.example.urlshortener.service.dto.CountryStatsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    @Autowired
    private ClickRepository clickRepository;

    @Autowired
    private UrlRepository urlRepository;

    public UrlAnalyticsDto getUrlAnalytics(String shortCode, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
            .orElseThrow(() -> new UrlNotFoundException("URL not found"));

        // Check ownership if user is authenticated
        if (userId != null && (url.getUser() == null || !url.getUser().getId().equals(userId))) {
            throw new UnauthorizedAccessException("Access denied");
        }

        UrlAnalyticsDto analytics = new UrlAnalyticsDto();
        analytics.setTotalClicks(url.getTotalClicks());
        // Note: uniqueVisitors is not directly calculable from the current schema without additional logic
        // For now, we will omit it or assume it's equal to totalClicks for simplicity or add a dummy value
        analytics.setUniqueVisitors(url.getTotalClicks()); // Dummy value

        // Get daily clicks
        List<Object[]> dailyStats = clickRepository.getDailyClickStats(url.getId());
        analytics.setDailyClicks(mapToDailyClicksDto(dailyStats));

        // Get top referrers
        Pageable topReferrersPageable = PageRequest.of(0, 10);
        List<Object[]> topReferrers = clickRepository.getTopReferrers(url.getId(), topReferrersPageable);
        analytics.setTopReferrers(mapToReferrerStatsDto(topReferrers));

        // Get top countries
        Pageable topCountriesPageable = PageRequest.of(0, 10);
        List<Object[]> topCountries = clickRepository.getTopCountries(url.getId(), topCountriesPageable);
        analytics.setTopCountries(mapToCountryStatsDto(topCountries));

        return analytics;
    }
    
    public List<DailyClicksDto> getDailyClickStats(String shortCode, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);
        List<Object[]> dailyStats = clickRepository.getDailyClickStats(url.getId());
        return mapToDailyClicksDto(dailyStats);
    }

    public List<ReferrerStatsDto> getTopReferrers(String shortCode, Long userId, Pageable pageable) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);
        List<Object[]> topReferrers = clickRepository.getTopReferrers(url.getId(), pageable);
        return mapToReferrerStatsDto(topReferrers);
    }

    public List<CountryStatsDto> getTopCountries(String shortCode, Long userId, Pageable pageable) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);
        List<Object[]> topCountries = clickRepository.getTopCountries(url.getId(), pageable);
        return mapToCountryStatsDto(topCountries);
    }

    private List<DailyClicksDto> mapToDailyClicksDto(List<Object[]> dailyStats) {
        return dailyStats.stream()
                .map(obj -> new DailyClicksDto((Date) obj[0], ((BigInteger) obj[1]).longValue()))
                .collect(Collectors.toList());
    }

    private List<ReferrerStatsDto> mapToReferrerStatsDto(List<Object[]> topReferrers) {
        return topReferrers.stream()
                .map(obj -> new ReferrerStatsDto((String) obj[0], ((BigInteger) obj[1]).longValue()))
                .collect(Collectors.toList());
    }

    private List<CountryStatsDto> mapToCountryStatsDto(List<Object[]> topCountries) {
        // In a real scenario, map country codes to full names using an external service or a local lookup table.
        // For now, we'll just use the country code as the name.
        return topCountries.stream()
                .map(obj -> new CountryStatsDto((String) obj[0], (String) obj[0], ((BigInteger) obj[1]).longValue()))
                .collect(Collectors.toList());
    }

    private void validateUserOwnership(Url url, Long userId) {
        if (userId != null && (url.getUser() == null || !url.getUser().getId().equals(userId))) {
            throw new UnauthorizedAccessException("Access denied: URL does not belong to the authenticated user.");
        }
    }
}







