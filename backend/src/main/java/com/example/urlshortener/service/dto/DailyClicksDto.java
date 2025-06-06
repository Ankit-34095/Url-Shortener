package com.example.urlshortener.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyClicksDto {
    private Date date;
    private Long clicks;
}







