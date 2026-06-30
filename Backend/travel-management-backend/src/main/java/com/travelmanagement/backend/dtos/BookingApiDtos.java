package com.travelmanagement.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

public class BookingApiDtos {
	@Data
	public static class SeatLockRequestDto{
		private Long userId;
		private Long scheduleId;
		private List<Long> seatIds;
	}
	
	@Data
	public static class SeatLockResponseDto{
		private String lockId;
		private List<String> lockedSeatNumbers;
		private LocalDateTime lockExpiresAt;
		private String status;
	}
	@Data
	public static class PassengerDto{
		private Long seatId;
		private String fullName;
		private int age;
		private String gender;
	}
	
	@Data
	public static class BookingRequestDto{
		private Long userId;
		private String lockId;
		private String paymentMethod;
		private List<PassengerDto> passengers;
	}
	@Data
	public static class BookingResponseDto{
		private Long bookingId;
		private String pnrNumber;
		private BigDecimal totalAmount;
		private String bookingStatus;
		private List<BookedSeatDto> bookedSeats;
	}
	
	@Data
    public static class BookedSeatDto {
        private String seatNumber;
        private String passengerName;
        private Integer age;
    }


    // ==========================================
    // 4. CANCELLATION DTOS
    // ==========================================

    @Data
    public static class CancellationResponseDto {
        private Long bookingId;
        private String pnrNumber;
        private String status; 
        private Double refundAmount; 
        private String refundStatus; // e.g., "INITIATED"
    }
}
