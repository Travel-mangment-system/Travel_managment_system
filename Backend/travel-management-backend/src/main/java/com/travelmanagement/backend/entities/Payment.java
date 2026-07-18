package com.travelmanagement.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"booking"})

public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.STRING)
	@Column(name="payment_method")
	private PaymentMethod paymentMethod;
	
	@Column(name="razorpay_order_id", unique = true, nullable = false)
    private String razorpayOrderId;
	
	@Column(name="razorpay_payment_id", unique = true)
    private String razorpayPaymentId;
	
	@Column(nullable = false,precision = 10,scale = 2)
	private BigDecimal amount;
	
	@Enumerated(EnumType.STRING)
	@Column(name="payment_status",nullable = false)
	private PaymentStatus paymentStatus;
	
	@Column(name="paid_at")
	private LocalDateTime paidAt;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="booking_id",nullable = false)
	private Booking booking;
	
	
	
	
}
