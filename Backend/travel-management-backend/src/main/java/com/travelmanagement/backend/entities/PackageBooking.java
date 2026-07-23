package com.travelmanagement.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@RequiredArgsConstructor
@Getter
@Setter
@Table(name = "Package_Booking")
public class PackageBooking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "package_booking_id")
	private Long packageBookingId;
	
	@Column(name = "no_of_travelers")
	private int numberOfTravelers;
	
	@Column(name = "total_amount_paid")
	private BigDecimal totalAmountPaid;
	
	@Column(name = "booking_date")
	private LocalDateTime bookingDate;
	
	@Column(name = "booking_status")
	@Enumerated(EnumType.STRING)
	private BookingStatus bookingStatus;
	
	@Column(name = "payment_id")
	private String paymentId;
	
	@Column(name = "special_request")
	private String specialRequests;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	

	@ManyToOne
	@JoinColumn(name = "holiday_package_id")
	private HolidayPackage holidayPackage;
	
}
