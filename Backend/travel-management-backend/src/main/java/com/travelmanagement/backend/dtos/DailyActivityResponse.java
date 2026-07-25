package com.travelmanagement.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyActivityResponse {

	private Long activityId;
	private String timeOfDay;
	private String description;
}
