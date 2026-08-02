package com.travelmanagement.backend.controllers;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.BusResponseDTO;
import com.travelmanagement.backend.dtos.ProviderDashboardStatsDTO;
import com.travelmanagement.backend.dtos.ProviderDto;
import com.travelmanagement.backend.dtos.ProviderRegisterDTO;
import com.travelmanagement.backend.dtos.UpcomingDepartureDTO;
import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusProvider;
import com.travelmanagement.backend.services.BusProviderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/providers")

@RequiredArgsConstructor

public class ProviderController {
	
	
	private final BusProviderService providerService;
	
	@PostMapping
	public ResponseEntity<BusProvider> registerProvider(@RequestBody ProviderRegisterDTO providerDTO) {
		BusProvider createdProvider = providerService.registerProvider(providerDTO);
		return new ResponseEntity<>(createdProvider, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProviderDto> getProviderById(@PathVariable Long id) {
		return ResponseEntity.ok(providerService.getProviderByID(id));
	}
	
	// --- NEW DASHBOARD ENDPOINTS ---

	/* Get
	 * Fetch top-level dashboard statistics for a specific provider
	 */
	@GetMapping("/{id}/dashboard/stats")
	public ResponseEntity<ProviderDashboardStatsDTO> getDashboardStats(@PathVariable Long id) {
		ProviderDashboardStatsDTO stats = providerService.getDashboardStats(id);
		return new ResponseEntity<>(stats, HttpStatus.OK);
	}

	/* Get
	 * Fetch a list of upcoming departures for the provider's data table
	 */
	@GetMapping("/{id}/schedules/upcoming")
	public ResponseEntity<List<UpcomingDepartureDTO>> getUpcomingDepartures(@PathVariable Long id) {
		List<UpcomingDepartureDTO> departures = providerService.getUpcomingDepartures(id);
		return new ResponseEntity<>(departures, HttpStatus.OK);
	}
	
	@GetMapping("/{id}/buses")
	public ResponseEntity<List<BusResponseDTO>> getProviderBuses(@PathVariable Long id) {
	    List<BusResponseDTO> buses = providerService.getAllBusesByProviderUserId(id);
	    return new ResponseEntity<>(buses, HttpStatus.OK);
	}
	
}