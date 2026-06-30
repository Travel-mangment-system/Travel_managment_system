package com.travelmanagement.backend.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.dtos.BookingApiDtos.BookedSeatDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.BookingRequestDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.BookingResponseDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.CancellationResponseDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.PassengerDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.SeatLockRequestDto;
import com.travelmanagement.backend.dtos.BookingApiDtos.SeatLockResponseDto;
import com.travelmanagement.backend.entities.BookedSeat;
import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.BusSchedule;
import com.travelmanagement.backend.entities.Gender;
import com.travelmanagement.backend.entities.Seat;
import com.travelmanagement.backend.entities.SeatLock;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.repositories.UserRepository;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.Booking.BusScheduleRepository;
import com.travelmanagement.backend.repositories.Booking.SeatLockRepository;
import com.travelmanagement.backend.repositories.Booking.SeatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
	private final BookingRepository bookingRepository; 
	private final SeatLockRepository seatLockRepository;
	private final UserRepository userRepository;
	private final BusScheduleRepository busScheduleRepository;
	private final SeatRepository seatRepository;
	@Override
	public SeatLockResponseDto lockSeat(SeatLockRequestDto requestDto) {
		//Fetch realated entities
		User user = userRepository.findById(requestDto.getUserId()).orElseThrow(()-> new RuntimeException("User not found"));
		
		BusSchedule schedule = busScheduleRepository.findById(requestDto.getScheduleId()).orElseThrow(()-> new RuntimeException("Schedule "));
		//lockreference is the field in seat entity. It is unique string which generated while locking seat 
		String lockReference = UUID.randomUUID().toString();
		LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
		
		List<String> lockedSeatNumbers = new ArrayList<>();
		
		for (Long seatId : requestDto.getSeatIds()) {
			Seat seat = seatRepository.findById(seatId).orElseThrow(()-> new RuntimeException("Seat not found "+ seatId));
			
			SeatLock seatLock = SeatLock.builder()
					.lockReference(lockReference)
					.seat(seat)
					.schedule(schedule)
					.user(user)
					.expiresAt(expiresAt)
					.build();
			
			seatLockRepository.save(seatLock);
			lockedSeatNumbers.add(seat.getSeatNumber());
		}
		
		SeatLockResponseDto response = new SeatLockResponseDto();
		response.setLockId(lockReference);
		response.setLockedSeatNumbers(lockedSeatNumbers);
		response.setLockExpiresAt(expiresAt);
		response.setStatus("LOCKED");
		
		return response;
	}
	@Override
	public BookingResponseDto createBooking(BookingRequestDto requestDto) {
		List<SeatLock> locks = seatLockRepository.findByLockReference(requestDto.getLockId());
		
		if(locks.isEmpty()) {
			throw new RuntimeException("Invalid Lock ID or locks have already been processed.");
		}
		
		if(LocalDateTime.now().isAfter(locks.get(0).getExpiresAt())) {
			seatLockRepository.deleteAll(locks);
			throw new RuntimeException("Seat lock has expired. Please select seats again.");
		}
		
		User user = userRepository.findById(requestDto.getUserId()).orElseThrow(()-> new RuntimeException("invalid userID"));
		BusSchedule schedule = locks.get(0).getSchedule();
		
		Booking booking = new Booking();
		booking.setUser(user);
		booking.setSchedule(schedule);
		booking.setBookingReference("TRVL-" + UUID.randomUUID().toString().substring(0,6).toUpperCase());
		booking.setBookingStatus(BookingStatus.CONFIRMED);
		
		
		BigDecimal farePerSeat = new BigDecimal("500.00"); 
        BigDecimal total = farePerSeat.multiply(new BigDecimal(requestDto.getPassengers().size()));
        booking.setTotalAmount(total);

        // 4. Create BookedSeat Entities mapping
        List<BookedSeat> bookedSeats = new ArrayList<>();
        
        for (PassengerDto passengerDto : requestDto.getPassengers()) {
            // Find the actual Seat object for this passenger
            Seat seat = seatRepository.findById(passengerDto.getSeatId())
                    .orElseThrow(() -> new RuntimeException("Seat not found!"));

            BookedSeat bookedSeat = new BookedSeat();
            bookedSeat.setPassengerName(passengerDto.getFullName());
            bookedSeat.setPassengerAge(passengerDto.getAge());
            bookedSeat.setPassengerGender(Gender.valueOf(passengerDto.getGender().toUpperCase()));
            bookedSeat.setSeat(seat);
            bookedSeat.setBooking(booking); // Link back to parent

            bookedSeats.add(bookedSeat);
        }

        booking.setBookedSeats(bookedSeats);

        // 5. Save Booking (cascades to BookedSeats)
        Booking savedBooking = bookingRepository.save(booking);

        // 6. Delete temporary locks
        seatLockRepository.deleteAll(locks);

        return mapToBookingResponse(savedBooking);
    }

    @Override
    public List<BookingResponseDto> getBookingsByUserId(Long userId) {
        return bookingRepository.findAllByUserId(userId).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
        return mapToBookingResponse(booking);
    }
//
    @Override
    @Transactional
    public CancellationResponseDto cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        booking.setBookingStatus(BookingStatus.CANCELLED); // Assuming enum has CANCELLED
        bookingRepository.save(booking);

        CancellationResponseDto response = new CancellationResponseDto();
        response.setBookingId(booking.getId());
        response.setPnrNumber(booking.getBookingReference());
        response.setStatus(booking.getBookingStatus().name());
        
        // Calculate 80% refund using BigDecimal math
        BigDecimal refund = booking.getTotalAmount().multiply(new BigDecimal("0.80"));
        response.setRefundAmount(refund.doubleValue());
        
        return response;
    }

    // --- Helper Method ---
    private BookingResponseDto mapToBookingResponse(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setBookingId(booking.getId());
        dto.setPnrNumber(booking.getBookingReference());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setBookingStatus(booking.getBookingStatus().name());

        List<BookedSeatDto> seats = booking.getBookedSeats().stream().map(bs -> {
        	BookedSeatDto sDto = new BookedSeatDto();
        	sDto.setPassengerName(bs.getPassengerName());
        	sDto.setAge(bs.getPassengerAge());
        	sDto.setSeatNumber(bs.getSeat().getSeatNumber());
        	return sDto;
        }).collect(Collectors.toList());
        dto.setBookedSeats(seats);
        return dto;
    }
}
