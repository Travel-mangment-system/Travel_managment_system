package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.entities.City;

public interface CityService {
	City addCity(City city);
	List<City> getAllCities();
	City getCityById(Long id);

}
