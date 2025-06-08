package com.example.urlshortener.service;

import com.example.urlshortener.exception.InvalidUrlException;
import com.example.urlshortener.exception.ShortCodeAlreadyExistsException;
import com.example.urlshortener.exception.ShortCodeGenerationException;
import com.example.urlshortener.exception.UrlExpiredException;
import com.example.urlshortener.exception.UrlNotActiveException;
import com.example.urlshortener.exception.UrlNotFoundException;
import com.example.urlshortener.exception.UserNotFoundException;
import com.example.urlshortener.model.Click;
import com.example.urlshortener.model.Url;
import com.example.urlshortener.model.User;
import com.example.urlshortener.repository.ClickRepository;
import com.example.urlshortener.repository.UrlRepository;
import com.example.urlshortener.repository.UserRepository;
import com.example.urlshortener.service.dto.CreateUrlRequestDto;
import com.example.urlshortener.service.dto.UrlDetailsDto;
import com.example.urlshortener.service.dto.UrlResponseDto;
import com.example.urlshortener.service.dto.UpdateUrlRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UrlService {
    // A distinct identifier for commit purposes (Service for URL shortening and management operations)
    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private ClickRepository clickRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate; // Redis caching for performance

    @Autowired
    private ShortCodeGenerator shortCodeGenerator;

    @Autowired
    private GeoLocationService geoLocationService;

    private static final String URL_CACHE_PREFIX = "url:";
    private static final Duration CACHE_TTL = Duration.ofHours(24);

    public UrlResponseDto createShortUrl(CreateUrlRequestDto request, Long userId) {
        // Validate original URL
        if (!isValidUrl(request.getOriginalUrl())) {
            throw new InvalidUrlException("Invalid URL format");
        }

        String shortCode;
        if (request.getCustomCode() != null && !request.getCustomCode().isEmpty()) {
            if (urlRepository.existsByShortCode(request.getCustomCode())) {
                throw new ShortCodeAlreadyExistsException("Custom code already exists");
            }
            shortCode = request.getCustomCode();
        } else {
            shortCode = generateUniqueShortCode();
        }

        Url url = new Url();
        url.setOriginalUrl(request.getOriginalUrl());
        url.setShortCode(shortCode);
        url.setTitle(request.getTitle());
        url.setDescription(request.getDescription()); // Set description
        url.setExpiresAt(request.getExpiresAt());

        if (userId != null) {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
            url.setUser(user);
        }

        Url savedUrl = urlRepository.save(url);

        // Cache the mapping
        cacheUrlMapping(shortCode, savedUrl.getOriginalUrl());

        return mapToUrlResponseDto(savedUrl);
    }

    @Transactional(readOnly = true)
    public String getOriginalUrl(String shortCode) {
        // Try Redis cache first
        String originalUrl = redisTemplate.opsForValue().get(URL_CACHE_PREFIX + shortCode);

        if (originalUrl != null) {
            return originalUrl;
        }

        // Fallback to database
        Url url = urlRepository.findByShortCode(shortCode)
            .orElseThrow(() -> new UrlNotFoundException("Short URL not found"));

        if (!url.getIsActive()) {
            throw new UrlNotActiveException("URL is inactive");
        }

        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UrlExpiredException("URL has expired");
        }

        // Cache for future requests
        cacheUrlMapping(shortCode, url.getOriginalUrl());

        return url.getOriginalUrl();
    }

    public void recordClick(String shortCode, HttpServletRequest request) {
        Url url = urlRepository.findByShortCode(shortCode)
            .orElse(null);

        if (url != null) {
            Click click = new Click();
            click.setUrl(url);
            click.setIpAddress(getClientIpAddress(request));
            click.setUserAgent(request.getHeader("User-Agent"));
            click.setReferrer(request.getHeader("Referer"));

            // Async IP geolocation
            geoLocationService.enrichClickWithLocation(click);

            clickRepository.save(click);

            // Update click count
            urlRepository.incrementClickCount(url.getId());
        }
    }

    public void recordClickAsync(String shortCode, HttpServletRequest request) {
        // In a real application, this would use an async mechanism (e.g., @Async, Message Queue)
        // For now, it's a direct call, but named to indicate intent.
        recordClick(shortCode, request);
    }

    @Transactional(readOnly = true)
    public Page<UrlResponseDto> getUserUrls(Long userId, Pageable pageable) {
        return urlRepository.findByUserIdAndIsActive(userId, true, pageable)
                .map(this::mapToUrlResponseDto);
    }

    @Transactional(readOnly = true)
    public UrlDetailsDto getUrlDetails(String shortCode, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);
        return mapToUrlDetailsDto(url);
    }

    public void updateUrl(String shortCode, UpdateUrlRequestDto request, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);

        if (request.getOriginalUrl() != null && !request.getOriginalUrl().isEmpty()) {
            if (!isValidUrl(request.getOriginalUrl())) {
                throw new InvalidUrlException("Invalid URL format");
            }
            url.setOriginalUrl(request.getOriginalUrl());
            // Invalidate cache if original URL changes
            redisTemplate.delete(URL_CACHE_PREFIX + shortCode);
        }
        if (request.getTitle() != null) {
            url.setTitle(request.getTitle());
        }
        if (request.getShortCode() != null && !request.getShortCode().isEmpty()) { // Allow updating short code
            if (urlRepository.existsByShortCode(request.getShortCode()) && !url.getShortCode().equals(request.getShortCode())) {
                throw new ShortCodeAlreadyExistsException("Custom code already exists");
            }
            url.setShortCode(request.getShortCode());
            redisTemplate.delete(URL_CACHE_PREFIX + shortCode); // Invalidate old cache
        }
        if (request.getDescription() != null) {
            url.setDescription(request.getDescription());
        }
        if (request.getExpiresAt() != null) {
            url.setExpiresAt(request.getExpiresAt());
        }
        if (request.getIsActive() != null) { // Allow updating active status
            url.setIsActive(request.getIsActive());
        }

        Url updatedUrl = urlRepository.save(url);
        // Refresh cache immediately with updated URL
        cacheUrlMapping(updatedUrl.getShortCode(), updatedUrl.getOriginalUrl()); // Use updated short code for cache key
    }

    public void deleteUrl(String shortCode, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);

        // Soft delete
        url.setIsActive(false);
        urlRepository.save(url);

        // Remove from cache
        redisTemplate.delete(URL_CACHE_PREFIX + shortCode);
    }

    public UrlDetailsDto deactivateUrl(String shortCode, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);
        url.setIsActive(false);
        urlRepository.save(url);
        redisTemplate.delete(URL_CACHE_PREFIX + shortCode);
        return mapToUrlDetailsDto(url);
    }

    public UrlDetailsDto activateUrl(String shortCode, Long userId) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        validateUserOwnership(url, userId);
        url.setIsActive(true);
        urlRepository.save(url);
        cacheUrlMapping(shortCode, url.getOriginalUrl());
        return mapToUrlDetailsDto(url);
    }


    private void cacheUrlMapping(String shortCode, String originalUrl) {
        redisTemplate.opsForValue().set(
            URL_CACHE_PREFIX + shortCode,
            originalUrl,
            CACHE_TTL
        );
    }

    private String generateUniqueShortCode() {
        String shortCode;
        int attempts = 0;
        do {
            shortCode = shortCodeGenerator.generate();
            attempts++;
            if (attempts > 10) {
                throw new ShortCodeGenerationException("Failed to generate unique short code");
            }
        } while (urlRepository.existsByShortCode(shortCode));

        return shortCode;
    }

    private boolean isValidUrl(String urlString) {
        try {
            new URL(urlString).toURI();
            return true;
        } catch (MalformedURLException | java.net.URISyntaxException e) {
            return false;
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress;
    }

    private UrlResponseDto mapToUrlResponseDto(Url url) {
        return new UrlResponseDto(url.getShortCode(), "http://short.ly/" + url.getShortCode(), url.getOriginalUrl());
    }

    private UrlDetailsDto mapToUrlDetailsDto(Url url) {
        return new UrlDetailsDto(url.getId(), url.getOriginalUrl(), url.getShortCode(), url.getTitle(), url.getDescription(), url.getTotalClicks(), url.getCreatedAt(), url.getExpiresAt());
    }

    private void validateUserOwnership(Url url, Long userId) {
        if (url.getUser() == null || !url.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Access denied");
        }
    }
}







