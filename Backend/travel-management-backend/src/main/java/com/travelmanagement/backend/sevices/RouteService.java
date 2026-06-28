package com.travelmanagement.backend.sevices;

import com.travelmanagement.backend.dtos.RouteDto.RouteRequest;
import com.travelmanagement.backend.dtos.RouteDto.RouteResponse;

public interface RouteService {

	RouteResponse createRoute(RouteRequest request);

}
