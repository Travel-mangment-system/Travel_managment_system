package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;


import com.travelmanagement.backend.entities.PackageStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HolidayPackageResponse {

	private Long packageId;
	private String title;
	private BigDecimal basePrice;
	private PackageStatus status;
	private Integer availableSpots;
	private String imageUrl;
}