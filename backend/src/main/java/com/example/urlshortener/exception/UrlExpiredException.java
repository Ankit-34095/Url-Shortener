package com.example.urlshortener.exception;

public class UrlExpiredException extends RuntimeException {
    // Added for commit purposes (URL expired exception)
    public UrlExpiredException(String message) {
        super(message);
    }
}







