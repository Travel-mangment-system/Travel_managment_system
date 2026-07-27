package com.travelmanagement.backend.controllers;

import com.travelmanagement.backend.dtos.*;
import com.travelmanagement.backend.services.BusService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/buses")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class BusController {

    private final BusService busService;

    @PostMapping
    public ResponseEntity<BusResponseDTO> addBus(@RequestBody BusRequestDTO request) {
        return new ResponseEntity<>(busService.addBus(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusResponseDTO> getBus(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BusResponseDTO> updateStatus(@PathVariable Long id, @RequestBody BusStatusRequestDTO request) {
        return ResponseEntity.ok(busService.updateStatus(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBus(@PathVariable Long id) {
        
        // Calls the service method we just built with the refund logic
        busService.deleteBus(id);
        
        return ResponseEntity.ok("Bus successfully deactivated and all future bookings have been refunded.");
    }
 // Add this new endpoint to fetch all buses
    @GetMapping
    public ResponseEntity<List<BusResponseDTO>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }
}