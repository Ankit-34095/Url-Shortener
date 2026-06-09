package com.example.urlshortener.service;

import com.example.urlshortener.model.Click;
import com.example.urlshortener.service.dto.IpApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NoOpGeoLocationService implements GeoLocationService {

    private final RestTemplate restTemplate;

    @Autowired
    public NoOpGeoLocationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void enrichClickWithLocation(Click click) {

        try {

            String ip = click.getIpAddress();

            if (ip == null || ip.isBlank()) {
                return;
            }

            String apiUrl = "https://ipwho.is/" + ip;

            IpApiResponse response =
                    restTemplate.getForObject(
                            apiUrl,
                            IpApiResponse.class
                    );

           if (response != null && response.isSuccess()) {

    click.setCountryCode(
            response.getCountry_code() != null
                    ? response.getCountry_code()
                    : "NA"
    );

    click.setCity(
            response.getCity() != null
                    ? response.getCity()
                    : "Unknown"
    );

} else {

    click.setCountryCode("NA");
    click.setCity("Unknown");
}

        } catch (Exception e) {

            click.setCountryCode("NA");
            click.setCity("Unknown");

            System.err.println(
                    "Geolocation lookup failed: "
                            + e.getMessage()
            );
        }
    }
}
