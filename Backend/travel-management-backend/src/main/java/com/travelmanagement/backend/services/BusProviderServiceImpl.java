package com.travelmanagement.backend.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.BusResponseDTO;
import com.travelmanagement.backend.dtos.ProviderDashboardStatsDTO;
import com.travelmanagement.backend.dtos.ProviderDto;
import com.travelmanagement.backend.dtos.ProviderRegisterDTO;
import com.travelmanagement.backend.dtos.UpcomingDepartureDTO;
import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusProvider;
import com.travelmanagement.backend.entities.BusSchedule;
import com.travelmanagement.backend.entities.BusStatus; 
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.repositories.BusProviderRepository;
import com.travelmanagement.backend.repositories.BusRepository;
import com.travelmanagement.backend.repositories.ScheduleRepository;
import com.travelmanagement.backend.repositories.UserRepository;
import com.travelmanagement.backend.repositories.Booking.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BusProviderServiceImpl implements BusProviderService {

	private final BusProviderRepository providerRepository;
	private final UserRepository userRepository;
	private final BusRepository busRepository;
	private final ScheduleRepository scheduleRepository;
	private final BookingRepository bookingRepository;

	@Override
	public BusProvider registerProvider(ProviderRegisterDTO providerDTO) {
		BusProvider provider = new BusProvider();
		provider.setCompanyName(providerDTO.getCompanyName());
		provider.setGstNumber(providerDTO.getGstNumber());
		provider.setAddress(providerDTO.getAddress());
		provider.setVerified(false);
		
		User user = userRepository.findById(providerDTO.getUserId())
				.orElseThrow(() -> new RuntimeException("User account not found with ID: " + providerDTO.getUserId()));
		
		provider.setUser(user);
		return providerRepository.save(provider);
	}

	// Updated to expect a User ID to act as the bridge
	@Override
	public ProviderDto getProviderByID(Long userId) {
		BusProvider busProvider = providerRepository.findByUserId(userId);
		ProviderDto dto = new ProviderDto();
		dto.setAddress(busProvider.getAddress());
//		dto.setBuses(busProvider.getBuses());
		dto.setCompanyName(busProvider.getCompanyName());
		dto.setGstNumber(busProvider.getGstNumber());
		dto.setId(busProvider.getId());
		dto.setUserId(busProvider.getUser().getId());
		return dto;
	}

	@Override
	public ProviderDashboardStatsDTO getDashboardStats(Long userId) {
		// 1. Fetch the provider using the User ID
		BusProvider provider = providerRepository.findByUserId(userId);
		
		// 2. Extract the actual Primary Key for the BusProvider table
		Long actualProviderId = provider.getId();
		
		// 3. Run the stats using the actualProviderId
		long totalBuses = busRepository.countByBusProviderId(actualProviderId);
		long activeBuses = busRepository.countByBusProviderIdAndStatus(actualProviderId, BusStatus.ACTIVE);
		long todaysTrips = scheduleRepository.countTodaysTrips(actualProviderId, LocalDate.now());
		long seatsBookedToday = bookingRepository.countSeatsBookedToday(actualProviderId, LocalDate.now());

		return new ProviderDashboardStatsDTO(totalBuses, activeBuses, todaysTrips, seatsBookedToday);
	}

	@Override
	public List<UpcomingDepartureDTO> getUpcomingDepartures(Long userId) {
		// 1. Fetch the provider using the User ID
		BusProvider provider = providerRepository.findByUserId(userId);
		
		// 2. Extract the actual Primary Key
		Long actualProviderId = provider.getId();

		// 3. Run the queries using the actualProviderId
		List<BusSchedule> upcomingSchedules = scheduleRepository.findUpcomingSchedules(actualProviderId);
		
		DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a"); 

		return upcomingSchedules.stream().limit(10).map(schedule -> {
			
			// Calculate booked seats: Total Bus Seats - Available Schedule Seats
			int bookedSeats = schedule.getBus().getTotalSeats() - schedule.getAvailableSeats();
			
			return UpcomingDepartureDTO.builder()
				.id(schedule.getScheduleId())
				.busNumber(schedule.getBus().getBusNumber()) 
				.route(schedule.getSourceCity() + " ➔ " + schedule.getDestinationCity())
				.departureTime(schedule.getDepartureDatetime().format(timeFormatter)) 
				.arrivalTime(schedule.getArrivalDatetime().format(timeFormatter))
				.bookedSeats(bookedSeats) 
				.totalSeats(schedule.getBus().getTotalSeats())
				.status(schedule.getStatus().name()) 
				.build();
				
		}).collect(Collectors.toList());
	}

	@Override
	public List<BusResponseDTO> getAllBusesByProviderUserId(Long userId) {
	    // 1. Fetch provider using User ID
	    BusProvider provider = providerRepository.findByUserId(userId);
	    // 2. Get the actual primary key
	    Long actualProviderId = provider.getId();

	    // 3. Fetch all buses linked to this provider
	    List<Bus> list = busRepository.findByBusProviderId(actualProviderId);
	    List<BusResponseDTO> dtolist = new ArrayList<>();
	    for (Bus bus : list) {
			BusResponseDTO dto = new BusResponseDTO();
			dto.setAmenities(bus.getAmenities());
			dto.setBusName(bus.getBusName());
			dto.setBusNumber(bus.getBusNumber());
			dto.setBusType(bus.getBusType());
			dto.setId(bus.getId());
			dto.setStatus(bus.getStatus());
			dto.setTotalSeats(bus.getTotalSeats());
			
			dtolist.add(dto);
		}
	    return dtolist;
	    
	}
}