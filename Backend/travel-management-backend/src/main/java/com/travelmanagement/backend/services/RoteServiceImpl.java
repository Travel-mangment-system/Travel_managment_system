package com.travelmanagement.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.RouteDto;
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
		route.setDistanceKm(request.getDistanceKm());
		route.setBaseFare(request.getBaseFare());
		
		Route savedRoute = routeRepo.save(route);
		RouteResponse routeRes= new RouteResponse();
		routeRes.setSourceCityName(source.getCityName());
		routeRes.setDestinationCityName(destination.getCityName());
		routeRes.setBaseFare(request.getBaseFare());
		routeRes.setDistanceKm(request.getDistanceKm());
		routeRes.setId(route.getId());
		return routeRes;
	}

	@Override
	public List<RouteResponse> getAllRoute() {
	    List<Route> routes = routeRepo.findAll();
	    
	    return routes.stream().map(route -> {
	        RouteResponse dto = new RouteResponse();
	        dto.setId(route.getId());
	        dto.setBaseFare(route.getBaseFare());
	        dto.setDistanceKm(route.getDistanceKm());
	        
	        // Safely map city names so Jackson doesn't crash on lazy-loading proxies
	        if (route.getStartCity() != null) {
	            dto.setSourceCityName(route.getStartCity().getCityName());
	        }
	        if (route.getEndCity() != null) {
	            dto.setDestinationCityName(route.getEndCity().getCityName());
	        }
	        return dto;
	    }).collect(Collectors.toList());
	}

}
