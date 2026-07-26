package com.travelmanagement.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyActivityRequest 
{

	@NotBlank(message = "Time slot is required")
	private String timeOfDay;
	@NotBlank(message = "Activity description is required")
	private String description;
}
