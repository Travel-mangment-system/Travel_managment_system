package com.travelmanagement.backend.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleRequest;
import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleResponse;
import com.travelmanagement.backend.dtos.ScheduleDto.SeatLayoutResponse;
import com.travelmanagement.backend.services.ScheduleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/schedules")
//@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ScheduleController {
	private final ScheduleService scheduleService;
	
	@PostMapping
	public ResponseEntity<?> createSchedule(@RequestBody ScheduleRequest request)
	{
		ScheduleResponse response = scheduleService.createSchedule(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	@GetMapping("/search")
    public ResponseEntity<List<ScheduleResponse>> searchSchedules(
            @RequestParam("source") Long sourceId,
            @RequestParam("destination") Long destinationId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<ScheduleResponse> responses = scheduleService.searchSchedules(sourceId, destinationId, date);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<SeatLayoutResponse> getSeatLayout(@PathVariable("id") Long scheduleId) {
        SeatLayoutResponse response = scheduleService.getSeatLayout(scheduleId);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> cancelSchedule(@PathVariable Long scheduleId) {
        
        // Calls the service method we just built with the 100% refund logic
        scheduleService.cancelSchedule(scheduleId);
        
        return ResponseEntity.ok("Schedule successfully cancelled and all passengers have been refunded 100%.");
    }
}
