package com.travelmanagement.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.PackageBookingDto;
import com.travelmanagement.backend.dtos.PackageBookingDto.CanceResponse;
import com.travelmanagement.backend.dtos.PackageBookingDto.MyBookingSummary;
import com.travelmanagement.backend.services.PackageBookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/packageBooking")
@RequiredArgsConstructor
public class PackageBookingController {
	
	private final PackageBookingService bookingService;
	
	/*
     * POST /api/packageBooking/packages/book
     * Takes userId directly from the request JSON DTO
     */
	@PostMapping("/packages/book")
	public ResponseEntity<PackageBookingDto.Response> bookPackage(@RequestBody PackageBookingDto.Request request) {
		// Pass the userId directly from your DTO
		PackageBookingDto.Response response = bookingService.bookPackage(request, request.getUserId());
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	/*
     * GET /api/packageBooking/user/{userId}
     * Retrieves all package bookings made by a specific customer using PathVariable
     */
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<MyBookingSummary>> getMyBookings(@PathVariable Long userId) {
		List<MyBookingSummary> myBookings = bookingService.getMyBookings(userId);
		return ResponseEntity.ok(myBookings);
	}
	
	/*
     * PUT /api/packageBooking/{bookingId}/cancel/user/{userId}
     * Takes both bookingId and userId from the URL to verify ownership before canceling
     */
	@PutMapping("/{bookingId}/cancel/user/{userId}")
	public ResponseEntity<CanceResponse> cancelBooking(
			@PathVariable Long bookingId, 
			@PathVariable Long userId) {
		
		CanceResponse response = bookingService.cancelBooking(bookingId, userId);
		return ResponseEntity.ok(response);
	}
	
	/*
     * GET /api/packageBooking/all
     * Retrieves all bookings for admin dashboard
     */
	@GetMapping("/all")
	public ResponseEntity<List<PackageBookingDto.AdminBookingSummary>> getAllBookings() {
		List<PackageBookingDto.AdminBookingSummary> allBookings = bookingService.getAllBookings();
		return ResponseEntity.ok(allBookings);
	}
}