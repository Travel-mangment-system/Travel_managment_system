package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerPackageDetailsDto {

    private Long packageId;

    private String title;

    private String description;

    private String imageUrl;

    private String destinationCity;

    private BigDecimal basePrice;

    private Integer durationDays;

    private Integer durationNights;

    private Integer availableSpots;

    private LocalDateTime departureDatetime;

    private LocalDateTime returnDatetime;
}