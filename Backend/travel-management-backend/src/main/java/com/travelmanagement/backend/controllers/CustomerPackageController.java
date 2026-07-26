package com.travelmanagement.backend.controllers;

 
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.services.HolidayPackageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/packages")
@RequiredArgsConstructor
public class CustomerPackageController {

	
	private final HolidayPackageService packageService;
	
	//Fetch active packages optional filters for catlog search logic
	@GetMapping
	public ResponseEntity<?> getActivePackages(
			@RequestParam(required = false) String destination,
			@RequestParam(required = false) BigDecimal minPrice,
			@RequestParam(required = false) BigDecimal maxPrice,
			Pageable pageable)
	{
		
		Page<HolidayPackage> availablePackages=packageService.searchActivePackages(destination,minPrice,maxPrice, pageable);
		return ResponseEntity.ok(availablePackages);
	}
	// fetch full details for a single package
	// hibernate handles pulling the nested itineraries and activities automatically based on entity mappings
	@GetMapping("/{id}")
	public ResponseEntity<?> getPackageDetails(@PathVariable Long id){
		HolidayPackage tourPackage = packageService.getPackageById(id);
		return ResponseEntity.ok(tourPackage);
	}
	
}
