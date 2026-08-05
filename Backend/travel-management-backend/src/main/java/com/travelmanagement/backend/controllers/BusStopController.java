package com.travelmanagement.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping; // 👇 1. ADD THIS IMPORT
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.BusStopDto.BusStopRequestDto;
import com.travelmanagement.backend.dtos.BusStopDto.BusStopResponseDto;
import com.travelmanagement.backend.services.BusStopService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bus-stops")
@RequiredArgsConstructor
public class BusStopController {
	private final BusStopService busStopService;
	
	@PostMapping
	public ResponseEntity<?> createBusStop(@RequestBody BusStopRequestDto requestDto){
		BusStopResponseDto createdStop = busStopService.addBusStop(requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdStop);
	}
	
	@GetMapping("/route/{routeId}")
	public ResponseEntity<?> getStopsForRoute(@PathVariable Long routeId){
		List<BusStopResponseDto> stops = busStopService.getStopsByRoute(routeId);
		return ResponseEntity.ok(stops);
	}
	
	// 👇 2. ADD THIS DELETE ENDPOINT METHOD BELOW
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBusStop(@PathVariable Long id) {
		busStopService.deleteBusStop(id);
		return ResponseEntity.ok().body("Bus stop deleted successfully");
	}
}