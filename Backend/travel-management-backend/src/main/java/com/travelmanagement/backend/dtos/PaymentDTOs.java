package com.travelmanagement.backend.dtos;

import lombok.Data;
import java.math.BigDecimal;

import com.travelmanagement.backend.entities.BookingStatus;

public class PaymentDTOs {

    @Data
    public static class CreateOrderRequest {
    	private String bookingType;
        private Long bookingId;
    }

    @Data
    public static class OrderResponse {
        private String razorpayOrderId;
        private BigDecimal amount;
        private String currency;
    }

    @Data
    public static class SignatureVerificationRequest {
        private Long bookingId;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;
    }
}