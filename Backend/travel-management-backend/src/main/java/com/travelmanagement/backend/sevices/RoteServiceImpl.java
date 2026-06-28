package com.travelmanagement.backend.sevices;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.RouteDto.RouteRequest;
import com.travelmanagement.backend.dtos.RouteDto.RouteResponse;
import com.travelmanagement.backend.entities.City;
import com.travelmanagement.backend.entities.Route;
import com.travelmanagement.backend.repositories.CityRepository;
import com.travelmanagement.backend.repositories.RouteRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RoteServiceImpl implements RouteService {
	private final RouteRepository routeRepo;
	private final CityRepository cityRepo;
	private final ModelMapper map;

	@Override
	public RouteResponse createRoute(RouteRequest request) {
		City source = cityRepo.findById(request.getSourceCityId()).orElseThrow(()-> new RuntimeException("Source city not found"));
		
		City destination = cityRepo.findById(request.getDestinationCityId()).orElseThrow(()-> new RuntimeException("Destination city not found"));
		
		Route route = new Route();
		route.setStartCity(source);
		route.setEndCity(destination);
		route.setDistanceKm(request.getDeistaneKm());
		route.setBaseFare(request.getBaseFare());
		
		Route savedRoute = routeRepo.save(route);
		return map.map(savedRoute, RouteResponse.class);
	}

}
