package com.travelmanagement.backend.dtos;

import lombok.Data;
import java.math.BigDecimal;

public class PaymentDTOs {

    @Data
    public static class CreateOrderRequest {
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