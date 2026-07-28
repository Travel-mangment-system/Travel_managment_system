package com.travelmanagement.backend.services;

import java.util.List;

import org.jspecify.annotations.Nullable;

import com.travelmanagement.backend.dtos.RouteDto;
import com.travelmanagement.backend.dtos.RouteDto.RouteRequest;
import com.travelmanagement.backend.dtos.RouteDto.RouteResponse;
import com.travelmanagement.backend.entities.Route;

public interface RouteService {

	RouteResponse createRoute(RouteRequest request);

	List<RouteDto.RouteResponse> getAllRoute();

}
