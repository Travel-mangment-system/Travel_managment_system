package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.CityDto;
import com.travelmanagement.backend.entities.City;

public interface CityService {
	String addCity(CityDto city);
	List<City> getAllCities();
	City getCityById(Long id);

}
