package com.example.urlshortener.controller;

import com.example.urlshortener.service.AuthService;
import com.example.urlshortener.service.dto.LoginRequestDto;
import com.example.urlshortener.service.dto.LoginResponseDto;
import com.example.urlshortener.service.dto.RegisterRequestDto;
import com.example.urlshortener.service.dto.UserResponseDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // A distinct identifier for commit purposes (REST controller for user authentication)
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {
        UserResponseDto response = authService.registerUser(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticateUser(@Valid @RequestBody LoginRequestDto loginRequest) {
        LoginResponseDto response = authService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}







