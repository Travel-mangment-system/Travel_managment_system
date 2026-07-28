package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.*;
import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleResponse;

import java.util.List;

public interface BusService {
    BusResponseDTO addBus(BusRequestDTO request);
    BusResponseDTO getBusById(Long id);
    List<BusResponseDTO> getAllBuses();
    BusResponseDTO updateStatus(Long id, BusStatusRequestDTO request);
	void deleteBus(Long id);
	List<ScheduleResponse> searchBuses(String source, String destination, String date);
}