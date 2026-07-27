package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.*;
import com.travelmanagement.backend.entities.*;
import com.travelmanagement.backend.repositories.BusProviderRepository;
import com.travelmanagement.backend.repositories.BusRepository;
import com.travelmanagement.backend.repositories.RouteRepository;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;
import com.travelmanagement.backend.repositories.Booking.BusScheduleRepository;
// Make sure this import matches exactly where your SeatRepository is located!
import com.travelmanagement.backend.repositories.Booking.SeatRepository; 

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final BusProviderRepository providerRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository; 
    private final BusScheduleRepository busScheduleRepository;
    private final BookingRepository bookingRepository;
    
    private final ModelMapper modelMapper;

    @Override
    public BusResponseDTO addBus(BusRequestDTO request) {
        BusProvider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Bus Provider not found with ID: " + request.getProviderId()));
        
        Bus bus = new Bus();
        bus.setBusNumber(request.getBusNumber());
        bus.setBusName(request.getBusName());
        bus.setBusType(request.getBusType());
        bus.setTotalSeats(request.getTotalSeats());
        bus.setBusProvider(provider);
        bus.setStatus(BusStatus.ACTIVE);
        
        if(request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new RuntimeException("Route not found with ID: " + request.getRouteId()));
            bus.setRoute(route);
        } else {
            bus.setRoute(null);
        }
        
        // Save the bus first so we have an ID for the seats to link to
        Bus savedBus = busRepository.save(bus);

        // --- NEW LOGIC: AUTO-GENERATE SEATS ---
        List<Seat> seatsToSave = new ArrayList<>();
        
        for (int i = 1; i <= savedBus.getTotalSeats(); i++) {
            Seat seat = new Seat();
            seat.setSeatNumber("S" + i);
            seat.setBus(savedBus);
            
            // Assign SeatType alternating between WINDOW and AISLE
            if (i % 2 == 0) {
                seat.setSeatType(SeatType.AISLE);
            } else {
                seat.setSeatType(SeatType.WINDOW);
            }
            
            seatsToSave.add(seat);
        }
        
        // Save all seats in one batch query for high performance
        seatRepository.saveAll(seatsToSave);
        // --------------------------------------

        return modelMapper.map(savedBus, BusResponseDTO.class);
    }

    @Override
    public BusResponseDTO getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
        
        return modelMapper.map(bus, BusResponseDTO.class);
    }

    @Override
    public BusResponseDTO updateStatus(Long id, BusStatusRequestDTO request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
        
        bus.setStatus(request.getStatus());
        return modelMapper.map(busRepository.save(bus), BusResponseDTO.class);
    }

    @Override
    public void deleteBus(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + busId));
        
        bus.setStatus(BusStatus.INACTIVE);
        busRepository.save(bus);

        // 2. Find all FUTURE schedules for this bus
        LocalDateTime now = LocalDateTime.now();
        List<BusSchedule> futureSchedules = busScheduleRepository.findByBusIdAndDepartureDatetimeAfter(busId, now);

        // 3. Process Cancellations and Refunds
        for (BusSchedule schedule : futureSchedules) {
            
            // Find all confirmed bookings for this schedule
            List<Booking> activeBookings = bookingRepository
                    .findBySchedule_ScheduleIdAndBookingStatus(schedule.getScheduleId(), BookingStatus.CONFIRMED);

            for (Booking booking : activeBookings) {
                // Change status to CANCELLED
                System.out.println("DEBUG: Cancelling booking ID: " + booking.getId());
                booking.setBookingStatus(BookingStatus.CANCELLED);
                
                // Calculate 100% Refund (Because it is the provider's fault)
                BigDecimal refundAmount = booking.getTotalAmount();
                
                // TODO: Call your PaymentService here to actually send the money back to the bank
                // paymentService.processRefund(booking.getPaymentId(), refundAmount);
                
                bookingRepository.save(booking);
                
                // TODO: Send an Email or SMS to the user letting them know!
            }
            schedule.setStatus(ScheduleStatus.CANCELLED);
            busScheduleRepository.save(schedule);
        }
    }

    // --- ADDED SEARCH LOGIC HERE ---
 // --- UPDATED SEARCH LOGIC ---
 // --- UPDATED SEARCH LOGIC FOR SCHEDULES ---
 // --- UPDATED SEARCH LOGIC USING SCHEDULE DTO ---
    @Override
    public List<ScheduleDto.ScheduleResponse> searchBuses(String source, String destination, String date) {
        
        // Fetch schedules from the database
        List<BusSchedule> schedules = busScheduleRepository
                .findBySourceCityIgnoreCaseAndDestinationCityIgnoreCaseAndStatus(
                source, 
                destination, 
                ScheduleStatus.SCHEDULED // Ensure this matches your enum
        );

        // Map the BusSchedule entity into your ScheduleResponse DTO
        return schedules.stream().map(schedule -> {
            ScheduleDto.ScheduleResponse dto = new ScheduleDto.ScheduleResponse();
            
            dto.setScheduleId(schedule.getScheduleId()); 
            dto.setSourceCity(schedule.getSourceCity());
            dto.setDestinationCity(schedule.getDestinationCity());
            dto.setDepartureDatetime(schedule.getDepartureDatetime());
            dto.setArrivalDatetime(schedule.getArrivalDatetime());
            dto.setFare(schedule.getFare());
            dto.setAvailableSeats(schedule.getAvailableSeats());
            dto.setRouteId(schedule.getRoute().getId());
            
            // Map the attached Bus details
            if (schedule.getBus() != null) {
                dto.setBusName(schedule.getBus().getBusName());
                dto.setBusNumber(schedule.getBus().getBusNumber());
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
}