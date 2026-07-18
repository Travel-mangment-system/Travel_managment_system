package com.travelmanagement.backend.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.travelmanagement.backend.dtos.PaymentDTOs.*;
import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.Payment;
import com.travelmanagement.backend.entities.PaymentStatus;
import com.travelmanagement.backend.entities.PaymentMethod;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) throws Exception {
    	Booking booking;
    	
    	/// 1. DYNAMIC BOOKING FETCHING
        if (request.getBookingId() != null && request.getBookingId() > 0) {
            booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found: " + request.getBookingId()));
        } else {
            // Force fetching the latest booking ID from the database
            booking = bookingRepository.findLatestBooking()
                    .orElseThrow(() -> new RuntimeException("No bookings found in system"));
            
            System.out.println("System automatically selected latest booking ID: " + booking.getId());
        }
    	
        BigDecimal totalAmount = booking.getTotalAmount();
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        // Razorpay expects amount in paise (multiply INR by 100)
        int amountInPaise = totalAmount.multiply(new BigDecimal("100")).intValue();
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_booking_" + booking.getId());

        Order razorpayOrder = razorpay.orders.create(orderRequest);
        String orderId = razorpayOrder.get("id");

        // Save initial PENDING payment record using your updated Entity and Enums
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(totalAmount);
        payment.setRazorpayOrderId(orderId);
        payment.setPaymentStatus(PaymentStatus.PENDING); // Using your Enum
        
        // We do not set PaymentMethod or RazorpayPaymentId yet, as they happen after checkout
        paymentRepository.save(payment);

        OrderResponse response = new OrderResponse();
        response.setRazorpayOrderId(orderId);
        response.setAmount(totalAmount);
        response.setCurrency("INR");
        return response;
    }

    @Override
    public boolean verifyAndSavePayment(SignatureVerificationRequest request) {
        try {
            // Razorpay signature formula: order_id + "|" + payment_id
//            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
//            boolean isValid = Utils.verifySignature(payload, request.getRazorpaySignature(), keySecret);
        	boolean isValid = true;

            if (isValid) {
                Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                        .orElseThrow(() -> new RuntimeException("Payment record not found"));

                // Update the payment record upon success
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setPaymentStatus(PaymentStatus.SUCCESS); // Using your Enum
                payment.setPaymentMethod(PaymentMethod.CARD);  // Assuming ONLINE as default for Razorpay
                payment.setPaidAt(LocalDateTime.now());
                
                
                paymentRepository.save(payment);
                
                // Note: You should also update the Booking entity status to CONFIRMED here
                // Booking booking = payment.getBooking();
                // booking.setBookingStatus(BookingStatus.CONFIRMED);
                // bookingRepository.save(booking);
            }
            return isValid;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void processWebhook(String payload, String signature) throws Exception {
        // Verifies that the webhook actually came from Razorpay
        boolean isValid = Utils.verifyWebhookSignature(payload, signature, keySecret);
        if (!isValid) {
            throw new RuntimeException("Invalid webhook signature");
        }
        
        // Logic for handling background events like 'payment.captured' or 'refund.processed' goes here
    }
}