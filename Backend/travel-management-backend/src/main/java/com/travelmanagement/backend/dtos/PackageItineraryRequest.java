package com.travelmanagement.backend.dtos;

import java.util.List;

import com.travelmanagement.backend.entities.DailyActivity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class PackageItineraryRequest {
	
	@Min(value = 1,message = "Day numbers must be at least 1")
	private int dayNumber;
	@NotBlank(message = "Day title is required")
	private String dayTitle;
	@NotBlank(message = "Hotel name is required")
	private String hotelName;
	@NotBlank(message = "Meals include is required")
	private String mealsIncluded;
	@NotEmpty(message = "At least one activity is required")
	private List<DailyActivityRequest> activities;
	
}
