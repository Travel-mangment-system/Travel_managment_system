package com.travelmanagement.backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.PackageBookingDto;
import com.travelmanagement.backend.dtos.PackageBookingDto.MyBookingSummary;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.repositories.UserRepository;
import com.travelmanagement.backend.services.PackageBookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/packageBooking")
@RequiredArgsConstructor
public class PackageBookingController {
	private final PackageBookingService bookingService;
	private final UserRepository userRepository;
	
	@PostMapping("/packages/book")
	public ResponseEntity<?> bookPackage(@RequestBody PackageBookingDto.Request request ){
		PackageBookingDto.Response response = bookingService.bookPackage(request);
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/my-bookings")
	@PreAuthorize("hasAnyAuthority('CUSTOMER','ADMIN')")
	public ResponseEntity<?> getMyBookings(Principal principal){
		String userEmail = principal.getName();
		
		User loggedInUser = userRepository.findByEmail(userEmail).orElseThrow(()-> new RuntimeException("User not found"));
		
		List<MyBookingSummary> myBookings = bookingService.getMyBookings(loggedInUser.getId());
		return ResponseEntity.ok(myBookings);
	}
	
	@PutMapping("/{bookingId}/cancel")
	@PreAuthorize("hasAnyAutority('CUSTOMER','ADMIN')")
	public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId, Principal principal){
		String userEmail = principal.getName();
		User loggedInUser = userRepository.findByEmail(userEmail).orElseThrow(()-> new RuntimeException("user not found"));
		
		PackageBookingDto.CanceResponse response = bookingService.cancelBooking(bookingId , loggedInUser.getId());
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> getAllBookings(){
		List<PackageBookingDto.AdminBookingSummary> allBookings = bookingService.getAllBookings();
		return ResponseEntity.ok(allBookings);
	}
}
