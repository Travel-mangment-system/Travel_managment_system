package com.travelmanagement.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingDepartureDTO {
    private Long id;
    private String busNumber;
    private String route;
    private String departureTime;
    private String arrivalTime;
    private int bookedSeats;
    private int totalSeats;
    private String status;
}