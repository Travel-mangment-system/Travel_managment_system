package com.travelmanagement.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.dtos.PackageItineraryRequest;
import com.travelmanagement.backend.dtos.PackageItineraryResponse;
import com.travelmanagement.backend.dtos.UpdatePackageStatusRequest;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageBooking;
import com.travelmanagement.backend.entities.PackageItinerary;
import com.travelmanagement.backend.repositories.PackageBookingRepository;
import com.travelmanagement.backend.services.HolidayPackageService;
import com.travelmanagement.backend.services.PackageItineraryService;


import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/packages")
public class AdminPackageController {

	private final HolidayPackageService holidayPackageService;
	private final PackageItineraryService packageItineraryService;
	private final PackageBookingRepository packageBookingRepository;
	@PostMapping
	public ResponseEntity<?> createPackage(@RequestBody HolidayPackageRequest request)
	{
		HolidayPackageResponse response=holidayPackageService.createPackage(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	@PostMapping("/{packageId}/itineraries")
	public ResponseEntity<PackageItineraryResponse> addItinerary(
	        @PathVariable Long packageId,
	        @Validated @RequestBody PackageItineraryRequest request) {

	    PackageItineraryResponse response =
	            packageItineraryService.addItinerary(packageId, request);

	    return ResponseEntity.status(HttpStatus.CREATED)
	            .body(response);
	}
	@PutMapping("/{packageId}")
	public ResponseEntity<?> updatePackage(@PathVariable Long packageId,@Validated @RequestBody HolidayPackageRequest request)
	{
		HolidayPackageResponse response = holidayPackageService.updatePackage(packageId,request);
		
		return ResponseEntity.ok(response);
	}
	@PutMapping("/{packageId}/status")
	public ResponseEntity<?>updateStatus(@PathVariable Long packageId,@RequestBody UpdatePackageStatusRequest request)
	{
		holidayPackageService.updatePackage(packageId, request.getStatus());
		return ResponseEntity.ok("Package status update.");
	}
	@DeleteMapping("/{packageId}")
    public ResponseEntity<String> deletePackage(@PathVariable Long packageId) {
        
        // Calls the service method we just built with the 100% refund logic
        holidayPackageService.deletePackage(packageId);
        
        return ResponseEntity.ok("Package successfully cancelled. The bus has been released, and all customers have been refunded 100%.");
    }
	@GetMapping
    public ResponseEntity<List<HolidayPackage>> getAllPackages() {
        List<HolidayPackage> packages = holidayPackageService.getAllPackages();
        return ResponseEntity.ok(packages);
    }
	
}