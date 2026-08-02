package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
 
public class ScheduleDto {

    @Data
    public static class ScheduleRequest {
        private Long busId;
        private Long routeId; 
        // We only need DateTimes now. The entity doesn't have a separate 'LocalDate' column.
        private LocalDateTime departureDatetime; 
        private LocalDateTime arrivalDatetime;
    }

    @Data
    public static class ScheduleResponse {
        private Long scheduleId;
        private Long RouteId;
        private String busNumber; 
        private String busName;   
        private String sourceCity;
        private String destinationCity;
        private LocalDateTime departureDatetime; 
        private LocalDateTime arrivalDatetime;   
        private BigDecimal fare;                 
        private Integer availableSeats;          
    }
    @Data
    public static class SeatLayoutResponse
    {
    	private Long scheduleId;
    	private int totalCapacity;
    	private List<SeatStatus> seats;
  
    }
    @Data
    public static class SeatStatus
    {
    	private String seatNumber;
    	private boolean isAvailable;
    	private boolean isLocked;
    }
}