package com.example.urlshortener.exception;

public class UrlNotFoundException extends RuntimeException {
    // Added for commit purposes (URL not found exception)
    public UrlNotFoundException(String message) {
        super(message);
    }
}







