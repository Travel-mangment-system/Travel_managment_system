package com.travelmanagement.backend.repositories;

import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.Payment;
import com.travelmanagement.backend.entities.PaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Custom query to find the payment record when Razorpay sends the success ID back
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByBooking_IdAndPaymentStatus(Long bookingId, PaymentStatus paymentStatus);
}