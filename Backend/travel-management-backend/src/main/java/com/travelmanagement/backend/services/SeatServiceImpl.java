package com.travelmanagement.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.dtos.SeatResponseDto;
import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.Seat;
import com.travelmanagement.backend.repositories.Booking.SeatRepository;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.Booking.SeatLockRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final SeatLockRepository seatLockRepository;

    @Override
    public List<SeatResponseDto> getSeatsForBusSchedule(Long busId, Long scheduleId) {
        // 1. Get all physical seats for this bus
        List<Seat> allSeats = seatRepository.findByBusId(busId);

        // 2. Fetch bookings using your exact method and extract the booked seat IDs
        List<Booking> bookings = bookingRepository.findBySchedule_ScheduleId(scheduleId);
        List<Long> bookedSeatIds = bookings.stream()
                .flatMap(booking -> booking.getBookedSeats().stream())
                .map(bookedSeat -> bookedSeat.getSeat().getId())
                .collect(Collectors.toList());

        // 3. Find all seat IDs that are currently locked (temporary 5-min holds) and not expired
        List<Long> lockedSeatIds = seatLockRepository.findActiveLockedSeatIds(scheduleId, LocalDateTime.now());

        // 4. Map to DTO and mark status dynamically
        return allSeats.stream().map(seat -> {
            SeatResponseDto dto = new SeatResponseDto();
            dto.setId(seat.getId());
            dto.setSeatNumber(seat.getSeatNumber());
            dto.setSeatType(seat.getSeatType());

            boolean isBookedOrLocked = bookedSeatIds.contains(seat.getId()) || lockedSeatIds.contains(seat.getId());
            dto.setBooked(isBookedOrLocked);

            return dto;
        }).collect(Collectors.toList());
    }
}