package com.travelmanagement.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.SeatResponseDto;
import com.travelmanagement.backend.entities.Seat;
import com.travelmanagement.backend.services.SeatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/bus/{busId}/schedule/{scheduleId}")
    public ResponseEntity<List<SeatResponseDto>> getSeats(
            @PathVariable Long busId, 
            @PathVariable Long scheduleId) {
        
        List<SeatResponseDto> seats = seatService.getSeatsForBusSchedule(busId, scheduleId);
        return ResponseEntity.ok(seats);
    }
}
