package com.travelmanagement.backend.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.RazorpayClient;
import com.travelmanagement.backend.dtos.PackageBookingDto;
import com.travelmanagement.backend.dtos.PackageBookingDto.AdminBookingSummary;
import com.travelmanagement.backend.dtos.PackageBookingDto.CanceResponse;
import com.travelmanagement.backend.dtos.PackageBookingDto.MyBookingSummary;
import com.travelmanagement.backend.dtos.PackageBookingDto.Request;
import com.travelmanagement.backend.dtos.PackageBookingDto.Response;
import com.travelmanagement.backend.dtos.PackageBookingDto.Traveler;
import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageBooking;
import com.travelmanagement.backend.entities.PackageTraveler;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;
import com.travelmanagement.backend.repositories.PackageBookingRepository;
import com.travelmanagement.backend.repositories.PackageTravelerRepository;
import com.travelmanagement.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PackageBookingServiceImpl implements PackageBookingService {
	
	private final PackageBookingRepository bookingRepository;
	private final PackageTravelerRepository travelerRepository;
	private final HolidayPackageRepository packageRepository;
	private final UserRepository userRepository;
	
	@org.springframework.beans.factory.annotation.Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
	
	
    @Override
	public Response bookPackage(Request request, Long userId) { 
		
		HolidayPackage holidayPackage = packageRepository.findById(request.getPackageId())
				.orElseThrow(()->new RuntimeException("Package not found"));
				
		// 👇 SECURITY CHECK: Block booking if the package has already departed
		if (holidayPackage.getDepartureDatetime() != null && holidayPackage.getDepartureDatetime().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Booking failed: This package has already departed and cannot be booked.");
		}
				
		User user = userRepository.findById(userId) 
				.orElseThrow(()->new RuntimeException("User not found"));
		
		int travlerCount = request.getTravlers().size();
		
		// validate capacity
		if (holidayPackage.getAvailableSpots() < travlerCount) {
			throw new RuntimeException("Not enough spots available.");
		}
		
		// calculate price
		BigDecimal baseprice = holidayPackage.getBasePrice().multiply(BigDecimal.valueOf(travlerCount));
		
		// 1. CREATE DRAFT BOOKING (Status = PENDING, No payment ID yet)
		PackageBooking booking = PackageBooking.builder()
										.numberOfTravelers(travlerCount)
										.totalAmountPaid(baseprice)
										.bookingDate(LocalDateTime.now())
										.bookingStatus(BookingStatus.PENDING) // Draft Status
										.paymentId(null) // No payment yet
										.specialRequests(request.getSpecialRequests())
										.user(user)
										.holidayPackage(holidayPackage)
										.build();
		
		booking = bookingRepository.save(booking);
		
		// 2. Save travelers
		for(Traveler t : request.getTravlers()) {
			PackageTraveler traveler = new PackageTraveler();
			traveler.setFullName(t.getFullName());
			traveler.setAge(t.getAge());
			traveler.setGender(t.getGender());
			traveler.setPackageBooking(booking);
			travelerRepository.save(traveler);
		}
		
		// NOTE: We do NOT reduce available spots yet! We wait for successful payment.

		Response response = new Response();
		response.setBookingId(booking.getPackageBookingId());
		response.setTotalAmountPaid(booking.getTotalAmountPaid());
		response.setBookingStatus(booking.getBookingStatus()); // Keep as Enum or String depending on your DTO
		response.setMessage("Booking Draft Created. Proceed to payment.");
		return response;
	}


	@Override
	@Transactional(readOnly = true) // <-- Required when fetching lazy collections
	public List<MyBookingSummary> getMyBookings(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("user id not found"));
		List<PackageBooking> bookings = user.getPackageBookings();
		
		return bookings.stream().map(booking -> {
			return PackageBookingDto.MyBookingSummary.builder()
					.bookingId(booking.getPackageBookingId())
					.packageTitle(booking.getHolidayPackage().getTitle())
					.numberOfTravelers(booking.getNumberOfTravelers())
					.totalAmountPaid(booking.getTotalAmountPaid())
					.bookingStatus(booking.getBookingStatus())
					.paymentId(booking.getPaymentId())
					.build();
		}).toList();
	}


	@Override
	public CanceResponse cancelBooking(Long bookingId, Long userId) {
		// fetch booking and ensure booking belongs to this exact user
		PackageBooking booking = bookingRepository.findByPackageBookingIdAndUser_Id(bookingId, userId)
				.orElseThrow(()->new RuntimeException("booking not found or you dont have permissions to cancel booking"));
		
		// prevent double-cancellations
		if(booking.getBookingStatus() == BookingStatus.CANCELLED) {
			throw new RuntimeException("This booking is already cancelled");
		}
		
		BigDecimal totalPaid = booking.getTotalAmountPaid();
		BigDecimal refundAmount = BigDecimal.ZERO;
		String message;
		
		// SCENARIO 1: Booking is CONFIRMED (Payment was made, seats were deducted)
		if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
			// Calculate 80% refund
			refundAmount = totalPaid.multiply(new java.math.BigDecimal("0.80"));
			
			// Process razorpay refund only if a valid payment ID exists
			if (booking.getPaymentId() != null && !booking.getPaymentId().trim().isEmpty()) {
				try {
					RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
					JSONObject refundRequest = new JSONObject();
					int refundAmountInPaise = refundAmount.multiply(new java.math.BigDecimal("100")).intValue();
					refundRequest.put("amount", refundAmountInPaise);
					razorpayClient.payments.refund(booking.getPaymentId(), refundRequest);
				} catch(Exception e) {
					throw new RuntimeException("Error while processing refund with razorpay: "+ e.getMessage());
				}
			}
			
			// Restore available spots on the package 
			HolidayPackage holidayPackage = booking.getHolidayPackage();
			holidayPackage.setAvailableSpots(holidayPackage.getAvailableSpots() + booking.getNumberOfTravelers());
			packageRepository.save(holidayPackage);
			
			message = "Booking cancelled successfully. 80% refund has been initiated.";
		} 
		// SCENARIO 2: Booking is PENDING (No payment made, seats were never deducted)
		else {
			message = "Draft booking cancelled successfully. No refund required.";
		}
		
		// Update booking status 
		booking.setBookingStatus(BookingStatus.CANCELLED);
		bookingRepository.save(booking);
		
		// Return response dto
		return PackageBookingDto.CanceResponse.builder()
				.bookingId(booking.getPackageBookingId())
				.bookingStatus(booking.getBookingStatus().name())
				.refundAmount(refundAmount)
				.message(message)
				.build();
	}


	@Override
	@Transactional(readOnly = true)
	public List<AdminBookingSummary> getAllBookings() {
		List<PackageBooking> bookings = bookingRepository.findAllByOrderByBookingDateDesc();
		
		return bookings.stream().map(booking -> {
			return PackageBookingDto.AdminBookingSummary.builder()
					.bookingId(booking.getPackageBookingId())
					.packageTitle(booking.getHolidayPackage().getTitle())
					.userId(booking.getUser().getId())
					.userEmail(booking.getUser().getEmail())
					.bookingDate(booking.getBookingDate())
					.numberOfTravelers(booking.getNumberOfTravelers())
					.totalAmountPaid(booking.getTotalAmountPaid())
					.bookingStatus(booking.getBookingStatus().name())
					.paymentId(booking.getPaymentId())
					.build();
		}).collect(Collectors.toList());
	}
}