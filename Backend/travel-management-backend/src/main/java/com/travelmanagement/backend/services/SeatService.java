package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.SeatResponseDto;
import com.travelmanagement.backend.entities.Seat;

public interface SeatService {
   

	List<SeatResponseDto> getSeatsForBusSchedule(Long busId, Long scheduleId);
}