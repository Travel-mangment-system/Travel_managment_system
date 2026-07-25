package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HolidayPackageSaveDTO {

	private String title;
	private String description;
	private BigDecimal basePrice;
	
	private Integer durationDays;
	private Integer durationNights;
	private String destinationCity;
	
	private LocalDateTime departureDatetime;
	private LocalDateTime returnDatetime;
	
	private Integer totalCapacity;
	
	private Long assignedBusId;
	
}
