package com.example.urlshortener.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:jdbc:postgresql://localhost:5432/urlshortener}")
    private String databaseUrl;

    @Value("${DB_USERNAME:shortener_user}")
    private String username;

    @Value("${DB_PASSWORD:password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        // Convert postgresql:// to jdbc:postgresql:// if needed
        String jdbcUrl = databaseUrl;
        if (databaseUrl.startsWith("postgresql://")) {
            jdbcUrl = databaseUrl.replace("postgresql://", "jdbc:postgresql://");
        }
        
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        
        return new HikariDataSource(config);
    }
}
