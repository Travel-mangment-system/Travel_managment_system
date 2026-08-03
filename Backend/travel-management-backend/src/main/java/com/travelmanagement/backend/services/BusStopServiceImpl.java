package com.travelmanagement.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.dtos.BusStopDto.BusStopRequestDto;
import com.travelmanagement.backend.dtos.BusStopDto.BusStopResponseDto;
import com.travelmanagement.backend.entities.BusStop;
import com.travelmanagement.backend.entities.Route;
import com.travelmanagement.backend.repositories.BusStopRepository;
import com.travelmanagement.backend.repositories.RouteRepository;

import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class BusStopServiceImpl implements BusStopService {
	private final BusStopRepository busStopRepository;
	private final RouteRepository routeRepository;
	
	@Override
	public BusStopResponseDto addBusStop(BusStopRequestDto requestDto) {
		Route route = routeRepository.findById(requestDto.getRouteId()).orElseThrow(()-> new RuntimeException("route id not found"));
		
		BusStop busStop = new BusStop();
		busStop.setStopName(requestDto.getStopName());
		busStop.setStopOrder(requestDto.getStopOrder());
		busStop.setArrivalTime(requestDto.getArrivalTime());
		busStop.setDepartureTime(requestDto.getDepartureTime());
		busStop.setRoute(route);
		
		BusStop savedStop = busStopRepository.save(busStop);
		
		return mapToResponseDto(savedStop);
	}
	
	private BusStopResponseDto mapToResponseDto(BusStop stop) {
        BusStopResponseDto dto = new BusStopResponseDto();
        dto.setId(stop.getId());
        dto.setStopName(stop.getStopName());
        dto.setStopOrder(stop.getStopOrder());
        dto.setArrivalTime(stop.getArrivalTime());
        dto.setDepartureTime(stop.getDepartureTime());
        dto.setRouteId(stop.getRoute().getId());
        return dto;
    }

	@Override
	public List<BusStopResponseDto> getStopsByRoute(Long routeId) {
		List<BusStop> stops = busStopRepository.findByRouteIdOrderByStopOrderAsc(routeId);
		
		return stops.stream()
				.map(this::mapToResponseDto)
				.collect(Collectors.toList());
	}

	@Override
	public void deleteBusStop(Long id) {
		if (!busStopRepository.existsById(id)) {
			throw new RuntimeException("Bus stop not found with id: " + id);
		}
		busStopRepository.deleteById(id);
	}
}