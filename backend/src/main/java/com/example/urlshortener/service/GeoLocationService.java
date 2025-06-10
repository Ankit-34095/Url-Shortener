package com.example.urlshortener.service;

import com.example.urlshortener.model.Click;

public interface GeoLocationService {
    void enrichClickWithLocation(Click click);
}







