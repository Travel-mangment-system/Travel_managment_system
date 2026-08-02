package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.BookingApiDtos.BookingRequestDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.BookingResponseDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.CancellationResponseDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.SeatLockRequestDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.SeatLockResponseDto;

public interface BookingService {

	SeatLockResponseDto lockSeat(SeatLockRequestDto requestDto);

	BookingResponseDto createBooking(BookingRequestDto requestDto);

	List<BookingResponseDto> getBookingsByUserId(Long userId);

	BookingResponseDto getBookingById(Long id);

	CancellationResponseDto cancelBooking(Long id);

	BookingResponseDto confirmPayment(Long bookingId, String paymentMethod);

}
