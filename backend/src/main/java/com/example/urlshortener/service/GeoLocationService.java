package com.example.urlshortener.service;

import com.example.urlshortener.model.Click;

public interface GeoLocationService {
    // Interface for geolocation services to enrich click data
    void enrichClickWithLocation(Click click);
}







