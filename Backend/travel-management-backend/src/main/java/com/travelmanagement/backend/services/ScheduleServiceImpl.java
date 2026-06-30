package com.travelmanagement.backend.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.travelmanagement.backend.dtos.RouteDto.RouteRequest;
import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleRequest;
import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleResponse;
import com.travelmanagement.backend.dtos.ScheduleDto.SeatLayoutResponse;
import com.travelmanagement.backend.dtos.ScheduleDto.SeatStatus;
import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusSchedule;
import com.travelmanagement.backend.entities.Route;
import com.travelmanagement.backend.entities.ScheduleStatus;
import com.travelmanagement.backend.repositories.BusRepository;
import com.travelmanagement.backend.repositories.RouteRepository;
import com.travelmanagement.backend.repositories.ScheduleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
	private final ScheduleRepository scheduleRepository;
	private final RouteRepository routeRepository;
	private final BusRepository busRepository;
	private final ModelMapper map;
	
	@Override
	public ScheduleResponse createSchedule(@RequestBody ScheduleRequest request)
	{
		int overlapCount= scheduleRepository.countOverlappingSchedules(
			request.getBusId(),
			request.getDepartureDatetime(),
			request.getArrivalDatetime()
		);
		if(overlapCount >0)
		{
			throw new RuntimeException("this bus is already schedules for another route during this time window !");
		}
		Bus bus = busRepository.findById(request.getBusId()).orElseThrow(()->new RuntimeException("Bus not found"));
		Route route = routeRepository.findById(request.getRouteId()).orElseThrow(()->new RuntimeException("Route not found"));
		BusSchedule busSchedule = new BusSchedule();
		busSchedule.setBus(bus);
		busSchedule.setRoute(route);
		busSchedule.setDepartureDatetime(request.getDepartureDatetime());
		busSchedule.setArrivalDatetime(request.getArrivalDatetime());
		// Dynamic initializations based on linked entities
		busSchedule.setFare(BigDecimal.valueOf(route.getBaseFare()));
		busSchedule.setAvailableSeats(bus.getTotalSeats());
		busSchedule.setStatus(ScheduleStatus.SCHEDULED);
		
		BusSchedule savedSchedule = scheduleRepository.save(busSchedule);
		return map.map(savedSchedule,ScheduleResponse.class);
		// 4. Map the response manually
		
		
	}
	@Override
	public List<ScheduleResponse> searchSchedules(Long sourceId, Long destinationId, LocalDate date)
	{
		LocalDateTime startOfDay = date.atStartOfDay();
		LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
		List<BusSchedule> schedules = scheduleRepository.findByRouteAndDate(sourceId,destinationId,startOfDay,endOfDay);
		return schedules.stream().map(sch->map.map(sch, ScheduleResponse.class))
				.collect(Collectors.toList());
	}
	
	@Override
	public SeatLayoutResponse getSeatLayout(Long scheduleId)
	{
		BusSchedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(()-> new RuntimeException("Schedule Not Found"));
		
		int capacity = schedule.getBus().getTotalSeats();
		
		SeatLayoutResponse response = new SeatLayoutResponse();
		response.setScheduleId(schedule.getId());
		response.setTotalCapacity(capacity);
		
		List<SeatStatus> seatList = new ArrayList<>();
		for(int i=1;i<=capacity;i++)
		{
			SeatStatus seat = new SeatStatus();
			seat.setSeatNumber("S"+i);
			seat.setAvailable(true);
			seat.setLocked(false);
			seatList.add(seat);
		}
		response.setSeats(seatList);
		return response;
	}
	
//	BusSchedule response = new BusSchedule();
//	response.setId(savedSchedule.getId());
//	response.set (bus.getBusName());
//	
			
	
}
