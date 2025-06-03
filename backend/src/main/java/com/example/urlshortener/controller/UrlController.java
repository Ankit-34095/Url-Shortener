package com.example.urlshortener.controller;

import com.example.urlshortener.service.UrlService;
import com.example.urlshortener.service.AuthService;
import com.example.urlshortener.service.dto.CreateUrlRequestDto;
import com.example.urlshortener.service.dto.UrlDetailsDto;
import com.example.urlshortener.service.dto.UrlResponseDto;
import com.example.urlshortener.service.dto.UpdateUrlRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private AuthService authService;

    @PostMapping("/shorten")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UrlResponseDto> shortenUrl(@Valid @RequestBody CreateUrlRequestDto createUrlRequest) {
        Long userId = authService.getCurrentUser().getId();
        UrlResponseDto response = urlService.createShortUrl(createUrlRequest, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/shorten/public")
    public ResponseEntity<UrlResponseDto> shortenPublicUrl(@Valid @RequestBody CreateUrlRequestDto createUrlRequest) {
        UrlResponseDto response = urlService.createShortUrl(createUrlRequest, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{shortCode}")
    public void redirect(@PathVariable String shortCode, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        String referrer = request.getHeader("Referer");
        String originalUrl = urlService.getOriginalUrlAndLogClick(shortCode, ipAddress, userAgent, referrer);
        response.sendRedirect(originalUrl);
    }

    @GetMapping("/urls")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<UrlDetailsDto>> getUserUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Long userId = authService.getCurrentUser().getId();
        Page<UrlDetailsDto> urls = urlService.getUrlsByUser(userId, pageable);
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/urls/{shortCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UrlDetailsDto> getUrlDetails(@PathVariable String shortCode) {
        Long userId = authService.getCurrentUser().getId();
        UrlDetailsDto urlDetails = urlService.getUrlDetails(shortCode, userId);
        return ResponseEntity.ok(urlDetails);
    }

    @PutMapping("/urls/{shortCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UrlDetailsDto> updateUrl(
            @PathVariable String shortCode,
            @Valid @RequestBody UpdateUrlRequestDto updateUrlRequest) {
        Long userId = authService.getCurrentUser().getId();
        UrlDetailsDto updatedUrl = urlService.updateUrl(shortCode, updateUrlRequest, userId);
        return ResponseEntity.ok(updatedUrl);
    }

    @DeleteMapping("/urls/{shortCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUrl(@PathVariable String shortCode) {
        Long userId = authService.getCurrentUser().getId();
        urlService.deleteUrl(shortCode, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/urls/{shortCode}/deactivate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UrlDetailsDto> deactivateUrl(@PathVariable String shortCode) {
        Long userId = authService.getCurrentUser().getId();
        UrlDetailsDto deactivatedUrl = urlService.deactivateUrl(shortCode, userId);
        return ResponseEntity.ok(deactivatedUrl);
    }

    @PostMapping("/urls/{shortCode}/activate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UrlDetailsDto> activateUrl(@PathVariable String shortCode) {
        Long userId = authService.getCurrentUser().getId();
        UrlDetailsDto activatedUrl = urlService.activateUrl(shortCode, userId);
        return ResponseEntity.ok(activatedUrl);
    }

    @GetMapping("/users/me/urls")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<UrlDetailsDto>> getMyUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return getUserUrls(page, size, sortBy, sortDir);
    }
}







