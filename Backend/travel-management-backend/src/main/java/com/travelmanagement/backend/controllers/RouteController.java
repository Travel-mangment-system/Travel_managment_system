package com.travelmanagement.backend.controllers;

import com.travelmanagement.backend.dtos.RouteDto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.travelmanagement.backend.sevices.RouteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {
	private final RouteService routeService;
	
	@PostMapping
	public ResponseEntity<?> createRoute(@RequestBody RouteRequest request){
		return ResponseEntity.ok(routeService.createRoute(request));
	}
}
