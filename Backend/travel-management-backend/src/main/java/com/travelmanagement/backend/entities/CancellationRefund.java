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
@Table(name="cancellation_refunds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude ={"booking"})

public class CancellationRefund {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="refund_amount",nullable = false,precision = 10,scale = 2)
	private BigDecimal refundAmount;
	
	@Enumerated(EnumType.STRING)
	@Column(name="refund_status",nullable = false)
	private RefundStatus refundStatus;
	
	@Column(name="processed_at")
	private LocalDateTime processedAt;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="booking_id",nullable = false)
	private Booking booking;

}
