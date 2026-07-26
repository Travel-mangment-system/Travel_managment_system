package com.travelmanagement.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.PackageBooking;

public interface PackageBookingRepository extends JpaRepository<PackageBooking, Long> {

	Optional<PackageBooking> findByPaymentId(String razorpayOrderId);

	Optional<PackageBooking> findByPackageBookingIdAndUser_Id(Long packageBookingId, Long userId);

	List<PackageBooking> findAllByOrderByBookingDateDesc();

	List<PackageBooking> findByHolidayPackage_PackageIdAndBookingStatus(Long packageId, BookingStatus confirmed);
	
	
}
