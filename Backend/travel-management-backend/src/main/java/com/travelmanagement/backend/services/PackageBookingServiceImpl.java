package com.travelmanagement.backend.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.razorpay.Payment;
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
	public Response bookPackage(Request request) {
		HolidayPackage holidayPackage = packageRepository.findById(request.getPackageId()).orElseThrow(()->new RuntimeException("Package not found"));
		User user = userRepository.findById(request.getUserId()).orElseThrow(()->new RuntimeException("User not found"));
		
		int travlerCount = request.getTravlers().size();
		
		//validate capacity seats are available or not
		if(holidayPackage.getAvailableSpots()<travlerCount) {
			throw new RuntimeException("not enough spots are available . only "+ holidayPackage.getAvailableSpots() +" are left");
		}
		
		//calculate price of tickets
		BigDecimal baseprice = holidayPackage.getBasePrice().multiply(BigDecimal.valueOf(travlerCount));
		
		//validate razorpay payment
		try {
			RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId,razorpayKeySecret);
			Payment payment = razorpayClient.payments.fetch(request.getPaymentId());
			
			String status = payment.get("status");
			if(!"captured".equals(status)) {
				throw new RuntimeException("payment validation failed. status is :"+ status);
			}
			
			//security check : ensure the amount paid matches the calculated base price
			//Razorpay returns amount in paise, so we multiply our base price by 100
			int expectedAmountInPaise = baseprice.multiply(BigDecimal.valueOf(100)).intValue();
			int actualAmountInPaise = payment.get("amount");
			
			if(expectedAmountInPaise != actualAmountInPaise) {
				throw new RuntimeException("payment amount mismatch ! Suspected tampering");
			}
		}
		catch(Exception e) {
			throw new RuntimeException("Error verifying payment with razorpay"+ e.getMessage());
		}
		//create booking record
		PackageBooking booking = PackageBooking.builder()
										.numberOfTravelers(travlerCount)
										.totalAmountPaid(baseprice)
										.bookingStatus(BookingStatus.CONFIRMED)
										.paymentId(request.getPaymentId())
										.specialRequests(request.getSpecialRequests())
										.user(user)
										.holidayPackage(holidayPackage)
										.build();
		
		booking = bookingRepository.save(booking);
		
		//save travelers
		for(Traveler t : request.getTravlers()) {
			PackageTraveler traveler = new PackageTraveler();
			traveler.setFullName(t.getFullName());
			traveler.setAge(t.getAge());
			traveler.setGender(t.getGender());
			traveler.setPackageBooking(booking);
			travelerRepository.save(traveler);
		}
		
		//reduce available seats
		holidayPackage.setAvailableSpots(holidayPackage.getAvailableSpots()-travlerCount);
		packageRepository.save(holidayPackage);
		
		//return response
		Response response = new Response();
		response.setBookingId(booking.getPackageBookingId());
		response.setTotalAmountPaid(booking.getTotalAmountPaid());
		response.setBookingStatus(booking.getBookingStatus());
		response.setMessage("Booking Confirmed");
		return response;
	}


	@Override
	public List<MyBookingSummary> getMyBookings(Long id) {
		User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("user id not found"));
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
	public CanceResponse cancelBooking(Long bookingId, Long id) {
		//fetch booking and ensure booking belongs to this exact user
		PackageBooking booking = bookingRepository.findByPackageBookingIdAndId(bookingId, id).orElseThrow(()->new RuntimeException("booking not found or you dont have permissions to cancel booking"));
		
		//prevent double-cancellations
		if(booking.getBookingStatus() == BookingStatus.CANCELLED) {
			throw new RuntimeException("This booking is already cancelled");
		}
		
		BigDecimal totalPaid = booking.getTotalAmountPaid();
        // Multiply by 0.80 for an 80% refund. 
        // Using String "0.80" in BigDecimal prevents floating-point precision errors (like 0.800000000001)
        BigDecimal refundAmount = totalPaid.multiply(new java.math.BigDecimal("0.80"));
		
		//process razorpay refund
		try {
			RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
			
			JSONObject refundRequest = new JSONObject();
			
			//convert refund amount in paise
			int refundAmountInPaise = refundAmount.multiply(new java.math.BigDecimal("100")).intValue();
			refundRequest.put("amount", refundAmountInPaise);
			
			//trigger the refund via razorpay SDK
			
			razorpayClient.payments.refund(booking.getPaymentId(), refundRequest);
		}catch(Exception e) {
			throw new RuntimeException("Error while processing refund with razorpay"+ e.getMessage());
		}
		
		//Update booking status 
		booking.setBookingStatus(BookingStatus.CANCELLED);
		bookingRepository.save(booking);
		
		//Restore available spots on the package 
		HolidayPackage holidayPackage = booking.getHolidayPackage();
		holidayPackage.setAvailableSpots(holidayPackage.getAvailableSpots()+booking.getNumberOfTravelers());
		packageRepository.save(holidayPackage);
		
		//return response dto
		return PackageBookingDto.CanceResponse.builder()
				.bookingId(booking.getPackageBookingId())
				.bookingStatus(booking.getBookingStatus().name())
				.refundAmount(booking.getTotalAmountPaid())
				.message("Booking cancelled successfully . 80% refund has been initiated to the original payment method")
				.build();
	}


	@Override
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
