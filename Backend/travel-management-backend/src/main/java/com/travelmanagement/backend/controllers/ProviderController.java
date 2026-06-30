package com.travelmanagement.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.ProviderRegisterDTO;
import com.travelmanagement.backend.entities.BusProvider;
import com.travelmanagement.backend.services.BusProviderService;

@RestController
@RequestMapping("/api/v1/providers")
public class ProviderController {
	
	@Autowired
	private BusProviderService providerService;
	
	/* Post
	 * Create a new bus provider profile
	 */
	@PostMapping
	public ResponseEntity<BusProvider> registerProvider(@RequestBody ProviderRegisterDTO providerDTO)
	{
		BusProvider createdProvider =providerService.registerProvider(providerDTO);
		return new ResponseEntity<>(createdProvider,HttpStatus.CREATED);
	}
	/*Get
	 * Fetch profile data of a specific bus provider matching its primary key
	 */
	@GetMapping("/{id}")
	public ResponseEntity<BusProvider> getProviderById(@PathVariable Long id){
		BusProvider provider=providerService.getProviderByID(id);
		return new ResponseEntity<>(provider,HttpStatus.OK);
	}
	
}
