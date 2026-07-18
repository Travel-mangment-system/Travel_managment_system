package com.travelmanagement.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.BookingApiDtos.BookingRequestDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.BookingResponseDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.CancellationResponseDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.SeatLockRequestDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.SeatLockResponseDto;
import com.travelmanagement.backend.services.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {
	private final BookingService bookingService;
	
	@PostMapping("/lock-seat")
	public ResponseEntity<?> lockSeat(@RequestBody SeatLockRequestDto requestDto){
		SeatLockResponseDto lockedSeat = bookingService.lockSeat(requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(lockedSeat);
	}
	/*
     * POST /api/v1/bookings
     * Submits passenger details and finalizes the booking.
     */
	@PostMapping
	public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto requestDto){
		BookingResponseDto createdBooking = bookingService.createBooking(requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
	}
	
	/*
     * GET /api/v1/bookings/user/{userId}
     * Retrieves all bookings made by a specific customer.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getUserBookings(@PathVariable Long userId) {
        List<BookingResponseDto> userBookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(userBookings);
    }

    /*
     * GET /api/v1/bookings/{id}
     * Gets the details of a single booking (useful for generating a PDF ticket).
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDto> getBookingReceipt(@PathVariable Long id) {
        BookingResponseDto ticketDetails = bookingService.getBookingById(id);
        return ResponseEntity.ok(ticketDetails);
    }
//
//    /**
//     * POST /api/v1/bookings/{id}/cancel
//     * Cancels the booking and triggers the refund process.
//     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<CancellationResponseDto> cancelBooking(@PathVariable Long id) {
        CancellationResponseDto cancellationDetails = bookingService.cancelBooking(id);
        return ResponseEntity.ok(cancellationDetails);
    }

}
