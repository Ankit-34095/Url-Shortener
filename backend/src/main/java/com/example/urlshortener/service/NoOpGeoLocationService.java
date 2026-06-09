package com.example.urlshortener.service;

import com.example.urlshortener.model.Click;
import org.springframework.stereotype.Service;
import com.example.urlshortener.service.dto.IpApiResponse;
import org.springframework.web.client.RestTemplate;

@Service
public class NoOpGeoLocationService implements GeoLocationService {

    @Override
    public void enrichClickWithLocation(Click click) {

    try {

        String ip = click.getIpAddress();

        if (ip == null || ip.isBlank()) {
            return;
        }

        String apiUrl =
                "https://ipapi.co/" + ip + "/json/";

        IpApiResponse response =
                restTemplate.getForObject(
                        apiUrl,
                        IpApiResponse.class
                );

        if (response != null) {

            click.setCountryCode(response.getCountry_code());
            click.setCity(response.getCity());

        } else {

            click.setCountryCode("Unknown");
            click.setCity("Unknown");
        }

    } catch (Exception e) {

        click.setCountryCode("Unknown");
        click.setCity("Unknown");

        System.err.println(
                "Geolocation lookup failed: "
                + e.getMessage()
        );
    }
  }
}








