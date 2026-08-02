package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.Gender;

import lombok.Builder;
import lombok.Data;

public class PackageBookingDto {
	@Data
	@Builder
	public static class AdminBookingSummary {
		private Long bookingId;
		private String packageTitle;
		
		private Long userId;
		private String userEmail;
		
		private LocalDateTime bookingDate;
		private int numberOfTravelers;
		private BigDecimal totalAmountPaid;
		private String bookingStatus;
		private String paymentId;
	}

	@Data
	public static class Request{
		private Long packageId;
		private Long userId;
		private String paymentId;
		private String specialRequests;
		private Long busId;
		private List<Traveler> travlers;
	}
	
	@Data
	public static class Traveler{
		private String fullName;
		private Integer age;
		private Gender gender;
	}
	
	@Data
	public static class Response{
		private Long bookingId;
		private BigDecimal totalAmountPaid;
		private BookingStatus bookingStatus;
		private String message;
		private Long busId;
	}
	
	@Data
	@Builder
	public static class MyBookingSummary {
		private Long bookingId;
		private String packageTitle;
		private LocalDateTime bookingDate;
		private int numberOfTravelers;
		private BigDecimal totalAmountPaid;
		private BookingStatus bookingStatus;
		private String paymentId;
		
		private List<String> travelerNames;
	}
	
	@Data
	@Builder
	public static class CanceResponse{
		private Long bookingId;
		private String bookingStatus;
		private BigDecimal refundAmount;
		private String message;
	}
}