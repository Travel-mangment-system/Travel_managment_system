package com.travelmanagement.backend.services;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import com.travelmanagement.backend.entities.BusStop;
import com.travelmanagement.backend.entities.Gender;
import com.travelmanagement.backend.entities.Seat;
import com.travelmanagement.backend.entities.SeatLock;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.repositories.UserRepository;
import com.travelmanagement.backend.repositories.BusStopRepository;
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
    private final BusStopRepository busStopRepository; // ADDED: To fetch bus stops

    @Override
    public SeatLockResponseDto lockSeat(SeatLockRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));
        
        BusSchedule schedule = busScheduleRepository.findById(requestDto.getScheduleId())
                .orElseThrow(()-> new RuntimeException("Schedule not found"));
        
        String lockReference = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
        
        List<String> lockedSeatNumbers = new ArrayList<>();
        
        for (Long seatId : requestDto.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(()-> new RuntimeException("Seat not found " + seatId));
            
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
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {
        List<SeatLock> locks = seatLockRepository.findByLockReference(requestDto.getLockId());
        
        if(locks.isEmpty()) {
            throw new RuntimeException("Invalid Lock ID or locks have already been processed.");
        }
        
        if(LocalDateTime.now().isAfter(locks.get(0).getExpiresAt())) {
            seatLockRepository.deleteAll(locks);
            throw new RuntimeException("Seat lock has expired. Please select seats again.");
        }
        
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(()-> new RuntimeException("Invalid userID"));
        BusSchedule schedule = locks.get(0).getSchedule();
        
        // --- ADDED: BUS STOP VALIDATION AND TIME MATCHING LOGIC ---
        BusStop boardingStop = busStopRepository.findById(requestDto.getBoardingStopId())
                .orElseThrow(() -> new RuntimeException("Boarding stop not found"));
        BusStop dropOffStop = busStopRepository.findById(requestDto.getDropOffStopId())
                .orElseThrow(() -> new RuntimeException("Drop off stop not found"));

        // Validate that both stops belong to the same route as the schedule
        if (!boardingStop.getRoute().getId().equals(schedule.getRoute().getId()) || 
            !dropOffStop.getRoute().getId().equals(schedule.getRoute().getId())) {
            throw new RuntimeException("Selected stops do not belong to this schedule's route.");
        }

        // Validate direction of travel
        if (boardingStop.getStopOrder() >= dropOffStop.getStopOrder()) {
            throw new RuntimeException("Invalid route direction. Drop off must be after boarding.");
        }

        // Calculate exact boarding and drop-off times (Handling Midnight Crossover)
        LocalDate travelDate = schedule.getDepartureDatetime().toLocalDate();
        LocalDateTime actualBoardingTime = LocalDateTime.of(travelDate, boardingStop.getArrivalTime());
        LocalDateTime actualDropOffTime = LocalDateTime.of(travelDate, dropOffStop.getArrivalTime());

        if (actualBoardingTime.isBefore(schedule.getDepartureDatetime())) {
            actualBoardingTime = actualBoardingTime.plusDays(1);
        }
        if (actualDropOffTime.isBefore(actualBoardingTime)) {
            actualDropOffTime = actualDropOffTime.plusDays(1);
        }
        // -----------------------------------------------------------

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setBookingReference("TRVL-" + UUID.randomUUID().toString().substring(0,6).toUpperCase());
        booking.setBookingStatus(BookingStatus.PENDING);
        
        //Dynamic pricing based on stops traveled
        
        //get the total base fare price for the entire route form schedule
        BigDecimal totalRouteFare = schedule.getFare();
        
        //find the total number of stops on this route
        int totalStops = busStopRepository.countByRouteId(schedule.getRoute().getId());
        
        //calculate total "segments" ex if there are 5 stops then there are 4 segments
        int totalSegments = Math.max(1, totalStops -1);
        
        //calculate how many segments this specific passenger is traveling
        int segmentsTraveled = dropOffStop.getStopOrder() - boardingStop.getStopOrder();
        
        //calculate the exact fare per seat
        BigDecimal farePerSegment  = totalRouteFare.divide(new BigDecimal(totalSegments), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal farePerSeat = farePerSegment.multiply(new BigDecimal(segmentsTraveled));
        
        //calculate total for all passengers for that boooking
        BigDecimal totalAmount = farePerSeat.multiply(new BigDecimal(requestDto.getPassengers().size()));
        booking.setTotalAmount(totalAmount);
        

        // Create BookedSeat Entities mapping
        List<BookedSeat> bookedSeats = new ArrayList<>();
        
        for (PassengerDto passengerDto : requestDto.getPassengers()) {
            Seat seat = seatRepository.findById(passengerDto.getSeatId())
                    .orElseThrow(() -> new RuntimeException("Seat not found!"));

            BookedSeat bookedSeat = new BookedSeat();
            bookedSeat.setPassengerName(passengerDto.getFullName());
            bookedSeat.setPassengerAge(passengerDto.getAge());
            bookedSeat.setPassengerGender(Gender.valueOf(passengerDto.getGender().toUpperCase()));
            bookedSeat.setSeat(seat);
            bookedSeat.setBooking(booking);
            
            // --- ADDED: Link the specific stops to this seat ---
            bookedSeat.setBoardingStop(boardingStop);
            bookedSeat.setDropOffStop(dropOffStop);
            // ---------------------------------------------------

            bookedSeats.add(bookedSeat);
        }

        booking.setBookedSeats(bookedSeats);
        Booking savedBooking = bookingRepository.save(booking);
        seatLockRepository.deleteAll(locks);

        return mapToBookingResponse(savedBooking);
    }
    
    @Override
    public List<BookingResponseDto> getBookingsByUserId(Long userId) {
        // Make sure your BookingRepository interface has: List<Booking> findAllByUserIdOrderByIdDesc(Long userId);
        return bookingRepository.findAllByUserIdOrderByIdDesc(userId).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public BookingResponseDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
        return mapToBookingResponse(booking);
    }
    
    @Override
    @Transactional
    public CancellationResponseDto cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
        
        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        CancellationResponseDto response = new CancellationResponseDto();
        response.setBookingId(booking.getId());
        response.setPnrNumber(booking.getBookingReference());
        response.setStatus(booking.getBookingStatus().name());
        
        BigDecimal refund = booking.getTotalAmount().multiply(new BigDecimal("0.80"));
        response.setRefundAmount(refund.doubleValue());
        
        return response;
    }

    private BookingResponseDto mapToBookingResponse(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setBookingId(booking.getId());
        dto.setPnrNumber(booking.getBookingReference());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setBookingStatus(booking.getBookingStatus().name());

        // --- NEW: Map Schedule and Bus Details ---
     // --- NEW: Map Schedule and Bus Details ---
        if (booking.getSchedule() != null) {
            dto.setDepartureDatetime(booking.getSchedule().getDepartureDatetime());
            dto.setArrivalDatetime(booking.getSchedule().getArrivalDatetime());
            
            if (booking.getSchedule().getBus() != null) {
                dto.setBusName(booking.getSchedule().getBus().getBusName());
                dto.setBusNumber(booking.getSchedule().getBus().getBusNumber());
                
                // Added .name() here to convert the Enum to a String!
                dto.setBusType(booking.getSchedule().getBus().getBusType().name());
            }
        }

        // --- NEW: Map Source and Destination from the first seat ---
        if (booking.getBookedSeats() != null && !booking.getBookedSeats().isEmpty()) {
            BookedSeat firstSeat = booking.getBookedSeats().get(0);
            if (firstSeat.getBoardingStop() != null) {
                dto.setSourceCity(firstSeat.getBoardingStop().getStopName());
            }
            if (firstSeat.getDropOffStop() != null) {
                dto.setDestinationCity(firstSeat.getDropOffStop().getStopName());
            }
        }

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
    
    @Override
    @Transactional
    public BookingResponseDto confirmPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
                
        // Switch status from PENDING to CONFIRMED once payment goes through
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);
        
        return mapToBookingResponse(savedBooking);
    }
}