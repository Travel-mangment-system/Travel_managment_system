package com.travelmanagement.backend.dtos;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Data;

public class BusStopDto {
	@Data
	public static class BusStopRequestDto{
		private String stopName;
		private Integer stopOrder;
		private LocalTime arrivalTime;
		private LocalTime departureTime;
		private Long routeId;
	}
	
	@Data
	public static class BusStopResponseDto{
		private Long id;
		private String stopName;
		private Integer stopOrder;
		private LocalTime arrivalTime;
		private LocalTime departureTime;
		private Long routeId;
		
	}
}
