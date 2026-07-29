package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerHomePackageDto {

    private Long packageId;

    private String title;

    private String destinationCity;

    private BigDecimal basePrice;

    private Integer durationDays;

    private Integer durationNights;

    private Integer availableSpots;

    private String imageUrl;
}