package com.travelmanagement.backend.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.travelmanagement.backend.dtos.PaymentDTOs.*;
import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.PackageBooking;
import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.Payment;
import com.travelmanagement.backend.entities.PaymentStatus;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;
import com.travelmanagement.backend.repositories.PackageBookingRepository;
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
    private final PackageBookingRepository packageBookingRepository;
    private final HolidayPackageRepository holidayPackageRepository;
    
    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) throws Exception {
        BigDecimal totalAmount;
        String receiptId;
        
        Payment payment = new Payment();

        // 1. DYNAMICALLY HANDLE PACKAGE VS BUS
        if ("PACKAGE".equalsIgnoreCase(request.getBookingType())) {
            PackageBooking packageBooking = packageBookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Package Booking not found: " + request.getBookingId()));
            
            totalAmount = packageBooking.getTotalAmountPaid();
            receiptId = "txn_pkg_" + packageBooking.getPackageBookingId();
            
            payment.setPackageBooking(packageBooking); 
            
        } else {
            Booking busBooking;
            if (request.getBookingId() != null && request.getBookingId() > 0) {
                busBooking = bookingRepository.findById(request.getBookingId())
                        .orElseThrow(() -> new RuntimeException("Bus Booking not found: " + request.getBookingId()));
            } else {
                busBooking = bookingRepository.findLatestBooking()
                        .orElseThrow(() -> new RuntimeException("No bookings found in system"));
            }
            
            totalAmount = busBooking.getTotalAmount();
            receiptId = "txn_bus_" + busBooking.getId();
            
            payment.setBooking(busBooking); 
        }
        
        // 2. CREATE RAZORPAY ORDER
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        int amountInPaise = totalAmount.multiply(new BigDecimal("100")).intValue();
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId);
        
        Order razorpayOrder = razorpay.orders.create(orderRequest);
        String orderId = razorpayOrder.get("id");
        
        // 3. SAVE PENDING PAYMENT TO DATABASE
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


            JSONObject options = new JSONObject();

            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (isValid) {
                // 1. UPDATE PAYMENT RECORD
                Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                        .orElseThrow(() -> new RuntimeException("Payment record not found"));

                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setPaymentStatus(PaymentStatus.SUCCESS); 
                payment.setPaidAt(LocalDateTime.now());
                paymentRepository.save(payment);
                
                // 2. DYNAMICALLY CONFIRM THE CORRECT BOOKING TYPE
                if (payment.getPackageBooking() != null) {
                    
                    PackageBooking pkgBooking = payment.getPackageBooking();
                    pkgBooking.setPaymentId(request.getRazorpayPaymentId()); 
                    pkgBooking.setBookingStatus(BookingStatus.CONFIRMED);
                    packageBookingRepository.save(pkgBooking);
                    
                    HolidayPackage holidayPackage = pkgBooking.getHolidayPackage();
                    holidayPackage.setAvailableSpots(holidayPackage.getAvailableSpots() - pkgBooking.getNumberOfTravelers());
                    holidayPackageRepository.save(holidayPackage);
                    
                } else if (payment.getBooking() != null) {
                    
                    Booking busBooking = payment.getBooking();
                    busBooking.setBookingStatus(BookingStatus.CONFIRMED); 
                    bookingRepository.save(busBooking);
                    
                    // Note: If you have bus seat reduction logic, it goes here!
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