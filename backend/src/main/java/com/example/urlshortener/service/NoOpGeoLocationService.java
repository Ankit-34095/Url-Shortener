package com.example.urlshortener.service;

import com.example.urlshortener.model.Click;
import org.springframework.stereotype.Service;

@Service
public class NoOpGeoLocationService implements GeoLocationService {

    @Override
    public void enrichClickWithLocation(Click click) {
        // This is a no-op implementation. In a real application, you would integrate with an external IP geolocation API here.
        // For demonstration, we'll just set some dummy data if the IP is present.
        if (click.getIpAddress() != null && !click.getIpAddress().isEmpty()) {
            // Dummy data for demonstration
            click.setCountryCode("US");
            click.setCity("Anytown");
            System.out.println("Simulating geolocation for IP: " + click.getIpAddress() + ", set to US/Anytown");
        }
    }
}








