package com.travelmanagement.backend.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.travelmanagement.backend.dtos.PaymentDTOs.*;
import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.PackageBooking; // <-- CHANGED: Imported new PackageBooking entity
import com.travelmanagement.backend.entities.BookingStatus;   // <-- CHANGED: Imported for setting status to CONFIRMED
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.Payment;
import com.travelmanagement.backend.entities.PaymentStatus;
import com.travelmanagement.backend.entities.PaymentMethod;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;
import com.travelmanagement.backend.repositories.PackageBookingRepository; // <-- CHANGED: Imported PackageBookingRepository
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
    private final PackageBookingRepository packageBookingRepository; // <-- CHANGED: Injected to handle Package data access
    private final HolidayPackageRepository holidayPackageRepository;
    
    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) throws Exception {
        BigDecimal totalAmount;
        String receiptId;
        
        Payment payment = new Payment(); // Instantiate early to attach the correct booking

        if ("PACKAGE".equalsIgnoreCase(request.getBookingType())) {
            PackageBooking packageBooking = packageBookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Package Booking not found: " + request.getBookingId()));
            
            totalAmount = packageBooking.getTotalAmountPaid();
            receiptId = "txn_pkg_booking_" + packageBooking.getPackageBookingId();
            
            // Link the payment to the package booking!
            payment.setPackageBooking(packageBooking); 
            
        } else {
            Booking busBooking;
            if (request.getBookingId() != null && request.getBookingId() > 0) {
                busBooking = bookingRepository.findById(request.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Booking not found: " + request.getBookingId()));
            } else {
                busBooking = bookingRepository.findLatestBooking()
                        .orElseThrow(() -> new RuntimeException("No bookings found in system"));
            }
            totalAmount = busBooking.getTotalAmount();
            receiptId = "txn_booking_" + busBooking.getId();
            
            // Link the payment to the bus booking!
            payment.setBooking(busBooking); 
        }
        
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        int amountInPaise = totalAmount.multiply(new BigDecimal("100")).intValue();
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId);
        
        Order razorpayOrder = razorpay.orders.create(orderRequest);
        String orderId = razorpayOrder.get("id");
        
        payment.setAmount(totalAmount);
        payment.setRazorpayOrderId(orderId);
        payment.setPaymentStatus(PaymentStatus.PENDING); 
        
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
        	// 1. Create a JSON object with the exact keys Razorpay expects
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            // 2. Use Razorpay's SDK utility to cryptographically verify the signature
            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (isValid) {
                Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                        .orElseThrow(() -> new RuntimeException("Payment record not found"));

                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setPaymentStatus(PaymentStatus.SUCCESS); 
                payment.setPaidAt(LocalDateTime.now());
                paymentRepository.save(payment);
                
                // FINAL STEP: CONFIRM THE BOOKING & REDUCE SEATS
                if (payment.getPackageBooking() != null) {
                     PackageBooking pkgBooking = payment.getPackageBooking();
                     
                     // 1. Update Booking Status
                     pkgBooking.setPaymentId(request.getRazorpayPaymentId()); 
                     pkgBooking.setBookingStatus(BookingStatus.CONFIRMED); // <--- Make it CONFIRMED
                     packageBookingRepository.save(pkgBooking);
                     
                     // 2. Reduce the available spots NOW because payment is successful!
                     HolidayPackage holidayPackage = pkgBooking.getHolidayPackage();
                     holidayPackage.setAvailableSpots(holidayPackage.getAvailableSpots() - pkgBooking.getNumberOfTravelers());
                     holidayPackageRepository.save(holidayPackage);
                }
            }
            return isValid;
        } catch (Exception e) {
            System.err.println("Signature verification exception: " + e.getMessage());
            return false;
        }
    }

    @Override
    public void processWebhook(String payload, String signature) throws Exception {
        boolean isValid = Utils.verifyWebhookSignature(payload, signature, keySecret);
        if (!isValid) {
            throw new RuntimeException("Invalid webhook signature");
        }
    }
}