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
	
	private String title;
	private String description;
	@NotNull(message = "Base price is required")
	@DecimalMin(value ="0.0", inclusive=false,message="Base price must be greater than zero")
	private BigDecimal basePrice;
	
	@NotNull(message="Duration days is required")
	@Min(value=1, message="Duration must be at least 1 day")
	private int durationDays;
	
	@NotNull(message="Duration nights is required")
	@Min(value=0,message="Duration city is required")
	private int durationNights;
	
	@NotBlank(message="Destination city is required")
	private String destinationCity;
	
	@NotNull(message="Departure date is required")
	@Future(message="Departure date must be in the future")
	private LocalDateTime departureDatetime;
	
	@NotNull(message = "Return date is required")
	private LocalDateTime returnDatetime;
	
	@NotNull(message="Total capacity is required")
	@Min(value = 1,message="Capacity must be at least1")
	private int totalCapacity;
	
	@NotNull(message="Bus ID is reequired")
	private Long busId;
	
	
	
	
	
}
