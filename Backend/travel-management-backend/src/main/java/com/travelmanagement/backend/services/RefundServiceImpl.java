package com.travelmanagement.backend.services;

import com.razorpay.RazorpayClient;
import com.razorpay.Refund;
import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.CancellationRefund;
import com.travelmanagement.backend.entities.PackageBooking;
import com.travelmanagement.backend.entities.Payment;
import com.travelmanagement.backend.entities.PaymentStatus;
import com.travelmanagement.backend.entities.RefundStatus;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.CancellationRefundRepository;
import com.travelmanagement.backend.repositories.PackageBookingRepository;
import com.travelmanagement.backend.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService { // 1. Added interface implementation

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final CancellationRefundRepository cancellationRefundRepository;
    private final PackageBookingRepository packageBookingRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override // 2. Added Override annotation
    @Transactional
    public CancellationRefund processRefund(Long bookingId, BigDecimal refundAmount) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Payment payment = paymentRepository.findByBooking_IdAndPaymentStatus(booking.getId(), PaymentStatus.SUCCESS)
                .orElseThrow(() -> new RuntimeException("No successful payment found for this booking"));

        int amountInPaise = refundAmount.multiply(new BigDecimal("100")).intValue();

        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);
            JSONObject refundJson = new JSONObject();
            refundJson.put("amount", amountInPaise);
            refundJson.put("speed", "optimum"); 
            
            Refund razorpayRefund = razorpayClient.payments.refund(payment.getRazorpayPaymentId(), refundJson);

            CancellationRefund refundRecord = new CancellationRefund();
            refundRecord.setBooking(booking);
            refundRecord.setRefundAmount(refundAmount);
            refundRecord.setRazorpayRefundId(razorpayRefund.get("id"));
            refundRecord.setRefundStatus(RefundStatus.PROCESSED);
            refundRecord.setProcessedAt(LocalDateTime.now());
            
            return cancellationRefundRepository.save(refundRecord);

        } catch (Exception e) {
            CancellationRefund failedRefund = new CancellationRefund();
            failedRefund.setBooking(booking);
            failedRefund.setRefundAmount(refundAmount);
            failedRefund.setRefundStatus(RefundStatus.FAILED);
            failedRefund.setProcessedAt(LocalDateTime.now());
            cancellationRefundRepository.save(failedRefund);
            
            throw new Exception("Razorpay Refund failed: " + e.getMessage());
        }
    }

    @Override // 3. Added Override annotation
    public List<CancellationRefund> getRefundsByUserId(Long userId) {
        return cancellationRefundRepository.findByBooking_User_Id(userId);
    }

    @Override 
    @Transactional
    public CancellationRefund cancelAndRefund(Long entityId, String bookingType, String canceledBy) throws Exception {
        BigDecimal totalAmountPaid;
        Payment payment;
        Booking busBooking = null;
        PackageBooking packageBooking = null;

        // 1. Fetch Payment and Booking based on Type
        if ("BUS".equalsIgnoreCase(bookingType)) {
            busBooking = bookingRepository.findById(entityId)
                    .orElseThrow(() -> new RuntimeException("Bus Booking not found"));
                    
            payment = paymentRepository.findByBooking_IdAndPaymentStatus(busBooking.getId(), PaymentStatus.SUCCESS)
                    .orElseThrow(() -> new RuntimeException("No successful payment found for this Bus booking"));
            
            totalAmountPaid = payment.getAmount();

        } else if ("PACKAGE".equalsIgnoreCase(bookingType)) {
            packageBooking = packageBookingRepository.findById(entityId)
                    .orElseThrow(() -> new RuntimeException("Package Booking not found"));
                    
            payment = paymentRepository.findByPackageBooking_PackageBookingIdAndPaymentStatus(packageBooking.getPackageBookingId(), PaymentStatus.SUCCESS)
                    .orElseThrow(() -> new RuntimeException("No successful payment found for this Package booking"));
            
            totalAmountPaid = payment.getAmount();
        } else {
            throw new IllegalArgumentException("Invalid booking type. Must be BUS or PACKAGE");
        }

        // 2. Calculate Refund Percentage: 80% if User cancels, 100% if Admin cancels
        BigDecimal refundAmount;
        if ("USER".equalsIgnoreCase(canceledBy)) {
            refundAmount = totalAmountPaid.multiply(new BigDecimal("0.80"));
        } else if ("ADMIN".equalsIgnoreCase(canceledBy)) {
            refundAmount = totalAmountPaid; 
        } else {
            throw new IllegalArgumentException("canceledBy must be USER or ADMIN");
        }

        // 3. Setup Refund Record
        CancellationRefund refundRecord = new CancellationRefund();
        if (busBooking != null) refundRecord.setBooking(busBooking);
        if (packageBooking != null) refundRecord.setPackageBooking(packageBooking);
        refundRecord.setRefundAmount(refundAmount);
        
        int amountInPaise = refundAmount.multiply(new BigDecimal("100")).intValue();
        
        // 4. Call Razorpay API
        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);
            JSONObject refundJson = new JSONObject();
            refundJson.put("amount", amountInPaise);
            refundJson.put("speed", "optimum"); 
            
            Refund razorpayRefund = razorpayClient.payments.refund(payment.getRazorpayPaymentId(), refundJson);

            refundRecord.setRazorpayRefundId(razorpayRefund.get("id"));
            refundRecord.setRefundStatus(RefundStatus.PROCESSED);
            refundRecord.setProcessedAt(LocalDateTime.now());
            
            return cancellationRefundRepository.save(refundRecord);

        } catch (Exception e) {
            refundRecord.setRefundStatus(RefundStatus.FAILED);
            refundRecord.setProcessedAt(LocalDateTime.now());
            cancellationRefundRepository.save(refundRecord);
            
            throw new Exception("Razorpay Refund failed: " + e.getMessage());
        }
    }
}