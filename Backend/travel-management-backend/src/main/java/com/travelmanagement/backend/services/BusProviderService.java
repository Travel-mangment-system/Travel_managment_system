package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.ProviderRegisterDTO;
import com.travelmanagement.backend.entities.BusProvider;

public interface BusProviderService {
	//Save a new bus owner profile
	BusProvider registerProvider(ProviderRegisterDTO providerDTO);
	
	//Finds a bus owner details using their Id
	BusProvider getProviderByID(Long id);

}
