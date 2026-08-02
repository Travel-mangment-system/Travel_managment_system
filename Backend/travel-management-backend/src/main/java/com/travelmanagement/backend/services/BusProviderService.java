package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.BusResponseDTO;
import com.travelmanagement.backend.dtos.ProviderDashboardStatsDTO;
import com.travelmanagement.backend.dtos.ProviderDto;
import com.travelmanagement.backend.dtos.ProviderRegisterDTO;
import com.travelmanagement.backend.dtos.UpcomingDepartureDTO;
import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusProvider;

public interface BusProviderService {
	//Save a new bus owner profile
	BusProvider registerProvider(ProviderRegisterDTO providerDTO);
	
	//Finds a bus owner details using their Id
	ProviderDto getProviderByID(Long id);

	ProviderDashboardStatsDTO getDashboardStats(Long id);

	List<UpcomingDepartureDTO> getUpcomingDepartures(Long id);

	List<BusResponseDTO> getAllBusesByProviderUserId(Long id);

}
