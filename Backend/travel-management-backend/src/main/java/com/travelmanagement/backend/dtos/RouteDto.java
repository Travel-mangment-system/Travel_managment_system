package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;

import lombok.Data;

public class RouteDto {
	@Data
	public static class RouteRequest{
		private Long sourceCityId;
		private Long destinationCityId;
		private BigDecimal distanceKm;
		private Double baseFare;
	}
	
	@Data
    public static class RouteResponse {
        private Long id;
        private String sourceCityName;
        private String destinationCityName;
        private BigDecimal distanceKm;
		private Double baseFare;
	}
}
