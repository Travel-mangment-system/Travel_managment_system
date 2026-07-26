package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.PackageBookingDto;
import com.travelmanagement.backend.dtos.PackageBookingDto.AdminBookingSummary;
import com.travelmanagement.backend.dtos.PackageBookingDto.CanceResponse;
import com.travelmanagement.backend.dtos.PackageBookingDto.MyBookingSummary;
import com.travelmanagement.backend.dtos.PackageBookingDto.Request;
import com.travelmanagement.backend.dtos.PackageBookingDto.Response;

public interface PackageBookingService {

	Response bookPackage(Request request, Long userId);

	List<MyBookingSummary> getMyBookings(Long userId);

	CanceResponse cancelBooking(Long bookingId, Long userId);

	List<AdminBookingSummary> getAllBookings();

}
