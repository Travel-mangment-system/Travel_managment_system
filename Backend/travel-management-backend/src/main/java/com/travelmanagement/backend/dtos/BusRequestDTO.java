package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.BusType;
import lombok.Data;

@Data
public class BusRequestDTO {
    private String busNumber;
    private String busName;
    private BusType busType;
    private int totalSeats;
    private Long providerId;
    private Long routeId;
}
