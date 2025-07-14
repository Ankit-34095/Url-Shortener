package com.example.urlshortener.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class RandomStringShortCodeGenerator implements ShortCodeGenerator {
    private static final Logger logger = LoggerFactory.getLogger(RandomStringShortCodeGenerator.class);
    // Generates random alphanumeric short codes
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        String shortCode = sb.toString();
        logger.debug("Generated short code: {}", shortCode);
        return shortCode;
    }
}







