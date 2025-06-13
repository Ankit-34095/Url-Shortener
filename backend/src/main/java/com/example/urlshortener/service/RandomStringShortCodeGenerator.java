package com.example.urlshortener.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class RandomStringShortCodeGenerator implements ShortCodeGenerator {

    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    @Override
    public String generate() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}







