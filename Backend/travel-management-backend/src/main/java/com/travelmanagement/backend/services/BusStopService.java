package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.BusStopDto.BusStopRequestDto;
import com.travelmanagement.backend.dtos.BusStopDto.BusStopResponseDto;

public interface BusStopService {

	BusStopResponseDto addBusStop(BusStopRequestDto requestDto);

	List<BusStopResponseDto> getStopsByRoute(Long routeId);

}
