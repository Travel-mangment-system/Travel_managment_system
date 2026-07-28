package com.travelmanagement.backend.controllers;

import com.travelmanagement.backend.dtos.PaymentDTOs.*;
import com.travelmanagement.backend.services.PaymentService;
import com.travelmanagement.backend.repositories.PackageBookingRepository;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.entities.PackageBooking;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    // 1. Inject your service and BOTH repositories
    private final PaymentService paymentService;
    private final PackageBookingRepository packageBookingRepository;
    private final BookingRepository bookingRepository;

    @PostMapping("/create-order")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse response = paymentService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody SignatureVerificationRequest request) {
        boolean isSuccess = paymentService.verifyAndSavePayment(request);
        
        if (isSuccess) {
            return ResponseEntity.ok("Payment Verified and Booking Confirmed");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment Verification Failed");
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            paymentService.processWebhook(payload, signature);
            return ResponseEntity.ok("Webhook Processed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook Error");
        }
    }
    
    @GetMapping("/test")
    public String test() { 
        return "Controller is working!"; 
    }

    // 2. Fetch the latest PACKAGE booking dynamically
    @GetMapping("/latest-package-id")
    public ResponseEntity<Long> getLatestPackageBookingId() {
        List<PackageBooking> bookings = packageBookingRepository.findAllByOrderByBookingDateDesc();
        
        if (bookings != null && !bookings.isEmpty()) {
            return ResponseEntity.ok(bookings.get(0).getPackageBookingId());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 3. Fetch the latest BUS booking dynamically
    @GetMapping("/latest-bus-id")
    public ResponseEntity<Long> getLatestBusBookingId() {
        return bookingRepository.findLatestBooking()
                .map(booking -> ResponseEntity.ok(booking.getId()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}