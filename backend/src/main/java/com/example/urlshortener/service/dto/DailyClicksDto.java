package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyClicksDto {
    // A distinct identifier for commit purposes (DTO for daily click statistics)
    private Date date;
    private Long clicks;
}







