package com.travelmanagement.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.ProviderRegisterDTO;
import com.travelmanagement.backend.entities.BusProvider;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.repositories.BusProviderRepository;
import com.travelmanagement.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BusProviderServiceImpl implements BusProviderService{

	private final BusProviderRepository providerRepository;
	private final UserRepository userRepository;
	
	@Override
	public BusProvider registerProvider(ProviderRegisterDTO providerDTO){
		BusProvider provider =new BusProvider();
		provider.setCompanyName(providerDTO.getCompanyName());
		provider.setGstNumber(providerDTO.getGstNumber());
		provider.setAddress(providerDTO.getAddress());
		provider.setVerified(false);
		
		User user = userRepository.findById(providerDTO.getUserId())
				.orElseThrow(() -> new RuntimeException("User account not found with ID: " + providerDTO.getUserId()));
		
		provider.setUser(user);
		
		return providerRepository.save(provider);
		
	}
	@Override
	public BusProvider getProviderByID(Long id) 
	{
		return providerRepository.findById(id)
				.orElseThrow(()-> new RuntimeException("Bus Provider profile not found with ID: "+id));
	}
}
