package com.travelmanagement.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.RouteDto.RouteRequest;
import com.travelmanagement.backend.services.RouteService;

import lombok.RequiredArgsConstructor;
//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {
	private final RouteService routeService;
	
	@PostMapping
	public ResponseEntity<?> createRoute(@RequestBody RouteRequest request){
		return ResponseEntity.status(HttpStatus.CREATED).body(routeService.createRoute(request));
	}
	
	@GetMapping
	public ResponseEntity<?> getAllRoutes(){
		return ResponseEntity.ok(routeService.getAllRoute());
	}
}
