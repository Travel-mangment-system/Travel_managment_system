package com.travelmanagement.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cancellation_refunds")
@Data
public class CancellationRefund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = true)
    private Booking booking;
    
    @OneToOne 
    @JoinColumn(name = "package_booking_id", nullable = true)
    private PackageBooking packageBooking;

    private BigDecimal refundAmount;

    private String razorpayRefundId;

    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus;

    private LocalDateTime processedAt;
}