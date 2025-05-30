package com.example.urlshortener.exception;

public class UserNotFoundException extends RuntimeException {
    // Added for commit purposes (User not found exception)
    public UserNotFoundException(String message) {
        super(message);
    }
}







