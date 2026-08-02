package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.BusStatus;
import com.travelmanagement.backend.entities.BusType;
import lombok.Data;

@Data
public class BusResponseDTO {
    private Long id;
    private String busNumber;
    private String busName;
    private BusType busType;
    private int totalSeats;
    private String amenities;
    private BusStatus status;
    // You can also include providerId or routeId if you need them in the frontend
}