package com.travelmanagement.backend.controllers;

import com.travelmanagement.backend.entities.CancellationRefund;
import com.travelmanagement.backend.services.RefundService; // Use interface
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/refunds")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173")
public class RefundController {

    private final RefundService refundService; // Use interface

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRefunds(@PathVariable Long userId) {
        try {
            List<CancellationRefund> refunds = refundService.getRefundsByUserId(userId);
            return refunds.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(refunds);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // New Endpoint for User-initiated Cancellations
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelAndRefund(@RequestBody CancelRequest request) {
        try {
            CancellationRefund refund = refundService.cancelAndRefund(
                    request.getBookingId(), 
                    request.getBookingType(), 
                    request.getCanceledBy()
            );
            return ResponseEntity.ok(refund);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Inner DTO for the request payload
    @Data
    public static class CancelRequest {
        private Long bookingId;
        private String bookingType; // "BUS" or "PACKAGE"
        private String canceledBy;  // "USER" or "ADMIN"
    }
}