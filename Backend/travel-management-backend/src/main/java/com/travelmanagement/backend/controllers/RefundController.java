package com.travelmanagement.backend.controllers;

import com.travelmanagement.backend.entities.CancellationRefund;
import com.travelmanagement.backend.services.RefundServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/refunds")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RefundController {

    private final RefundServiceImpl refundService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRefunds(@PathVariable Long userId) {
        try {
            List<CancellationRefund> refunds = refundService.getRefundsByUserId(userId);
            return refunds.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(refunds);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}