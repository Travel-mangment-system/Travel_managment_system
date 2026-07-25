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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
//@RequiredArgsConstructor
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
	
//	@Column(name = "user_id")
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
//	@Column(name = "package_id")
	@ManyToOne
	@JoinColumn(name = "holiday_package_id")
	private HolidayPackage holidayPackage;
	
}
