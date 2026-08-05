package com.travelmanagement.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.travelmanagement.backend.dtos.CustomerHomePackageDto;
import com.travelmanagement.backend.dtos.CustomerPackageDetailsDto;
import com.travelmanagement.backend.services.HolidayPackageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/customer/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerPackageController {

    private final HolidayPackageService holidayPackageService;

    // ===============================
    // Home Page Packages
    // ===============================
    @GetMapping
    public ResponseEntity<List<CustomerHomePackageDto>> getHomePackages() {

        return ResponseEntity.ok(
                holidayPackageService.getCustomerHomePackages());

    }

    // ===============================
    // Package Details
    // ===============================
    @GetMapping("/{packageId}")
    public ResponseEntity<CustomerPackageDetailsDto> getPackageDetails(
            @PathVariable Long packageId) {

        return ResponseEntity.ok(
                holidayPackageService.getCustomerPackageDetails(packageId));

    }
    
    @GetMapping("/search")
    public ResponseEntity<List<CustomerHomePackageDto>> searchPackages(
            @RequestParam String destination,
            @RequestParam(required = false) Double budget) {
        
        return ResponseEntity.ok(
                holidayPackageService.searchCustomerPackages(destination, budget));
    }

}