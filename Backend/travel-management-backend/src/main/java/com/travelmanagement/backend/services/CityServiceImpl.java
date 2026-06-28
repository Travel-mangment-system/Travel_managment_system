package com.travelmanagement.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelmanagement.backend.entities.City;
import com.travelmanagement.backend.repositories.CityRepository;

@Service
public class CityServiceImpl implements CityService{

	@Autowired
	private CityRepository cityRepository;
	
	@Override
	public City addCity(City city) 
	{
		return cityRepository.save(city);
	} 
	
	@Override
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    public City getCityById(Long id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }
}