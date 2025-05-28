package com.example.urlshortener.repository;

import com.example.urlshortener.model.Click;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickRepository extends JpaRepository<Click, Long> {
    @Query("SELECT DATE(c.clickedAt) as date, COUNT(c) as clicks " +
           "FROM Click c WHERE c.url.id = :urlId " +
           "GROUP BY DATE(c.clickedAt) ORDER BY date DESC")
    List<Object[]> getDailyClickStats(@Param("urlId") Long urlId);
    
    @Query("SELECT c.referrer, COUNT(c) as clicks " +
           "FROM Click c WHERE c.url.id = :urlId AND c.referrer IS NOT NULL " +
           "GROUP BY c.referrer ORDER BY clicks DESC")
    List<Object[]> getTopReferrers(@Param("urlId") Long urlId, Pageable pageable);
    
    @Query("SELECT c.countryCode, COUNT(c) as clicks " +
           "FROM Click c WHERE c.url.id = :urlId AND c.countryCode IS NOT NULL " +
           "GROUP BY c.countryCode ORDER BY clicks DESC")
    List<Object[]> getTopCountries(@Param("urlId") Long urlId, Pageable pageable);
}







