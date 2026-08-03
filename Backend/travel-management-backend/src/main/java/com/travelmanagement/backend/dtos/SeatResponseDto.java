package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.SeatType;
import lombok.Data;

@Data
public class SeatResponseDto {
    private Long id;
    private String seatNumber;
    private SeatType seatType;
    private boolean isBooked; // Calculated dynamically!
}