package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.PaymentDTOs.*;

public interface PaymentService {
    OrderResponse createOrder(CreateOrderRequest request) throws Exception;
    boolean verifyAndSavePayment(SignatureVerificationRequest request);
    void processWebhook(String payload, String signature) throws Exception;
}