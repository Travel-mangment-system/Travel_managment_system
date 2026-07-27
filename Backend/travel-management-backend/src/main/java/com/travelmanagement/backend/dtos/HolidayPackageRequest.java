package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HolidayPackageRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than zero")
    private BigDecimal basePrice;

    @Min(value = 1, message = "Duration must be at least 1 day")
    private int durationDays;

    @Min(value = 0, message = "Duration nights cannot be negative")
    private int durationNights;

    @NotBlank(message = "Destination city is required")
    private String destinationCity;

    @NotNull(message = "Departure date is required")
    @Future(message = "Departure date must be in the future")
    private LocalDateTime departureDatetime;

    @NotNull(message = "Return date is required")
    private LocalDateTime returnDatetime;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int totalCapacity;

    @NotNull(message = "Bus ID is required")
    private Long busId;
}