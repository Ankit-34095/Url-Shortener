package com.example.urlshortener.config;

import com.example.urlshortener.model.Click;
import com.example.urlshortener.model.Url;
import com.example.urlshortener.model.User;
import com.example.urlshortener.repository.ClickRepository;
import com.example.urlshortener.repository.UrlRepository;
import com.example.urlshortener.repository.UserRepository;
import com.example.urlshortener.service.ShortCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataLoader {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private ClickRepository clickRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ShortCodeGenerator shortCodeGenerator;

    @Bean
    @Transactional
    public CommandLineRunner loadData() {
        return args -> {
            // Create users
            User user1 = new User(null, "john.doe@example.com", passwordEncoder.encode("password"), "John", "Doe", true, LocalDateTime.now(), LocalDateTime.now(), Arrays.asList());
            User user2 = new User(null, "jane.smith@example.com", passwordEncoder.encode("password"), "Jane", "Smith", true, LocalDateTime.now(), LocalDateTime.now(), Arrays.asList());
            userRepository.saveAll(Arrays.asList(user1, user2));

            // Create URLs for user1
            Url url1 = new Url(null, user1, "https://www.google.com", shortCodeGenerator.generate(), "Google Search", "The world\'s most popular search engine", 0L, true, LocalDateTime.now(), LocalDateTime.now().plusMonths(6), new ArrayList<>());
            Url url2 = new Url(null, user1, "https://spring.io", shortCodeGenerator.generate(), "Spring Framework", "Pivotal\'s Spring Framework homepage", 0L, true, LocalDateTime.now(), null, new ArrayList<>());
            urlRepository.saveAll(Arrays.asList(url1, url2));

            // Create URLs for user2
            Url url3 = new Url(null, user2, "https://github.com", shortCodeGenerator.generate(), "GitHub", "Where the world builds software", 0L, true, LocalDateTime.now(), LocalDateTime.now().plusYears(1), new ArrayList<>());
            urlRepository.save(url3);

            // Create some clicks for url1
            Click click1 = new Click(null, url1, "192.168.1.1", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36", "https://example.com", "US", "New York", LocalDateTime.now().minusHours(5));
            Click click2 = new Click(null, url1, "192.168.1.2", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36", "https://google.com", "CA", "Toronto", LocalDateTime.now().minusHours(3));
            clickRepository.saveAll(Arrays.asList(click1, click2));

            url1.setTotalClicks(url1.getTotalClicks() + 2); // Manually update total clicks for demonstration
            urlRepository.save(url1);

            System.out.println("Sample data loaded successfully!");
        };
    }
}








