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

import com.travelmanagement.backend.entities.City;
import com.travelmanagement.backend.services.CityService;




@RestController
@RequestMapping("/api/v1/cities")
public class CityController {

	@Autowired
	private CityService cityService;
	
	/*Post /api.v1/cities
	 * Purpose :Add a new city to the location engine database.
	 */

	@PostMapping
	public ResponseEntity<City> addCity(@RequestBody City city)
	{
		City createdCity=cityService.addCity(city);
		return new ResponseEntity<>(createdCity,HttpStatus.CREATED);
	}
	
	/*
	 * GET /api/vi.cities
	 * Purpose :Fetch a list of all cities registered on the platform
	 */
	
	@GetMapping
	public ResponseEntity<List<City>> getAllCities()
	{
		List<City> cities= cityService.getAllCities();
		return new ResponseEntity<>(cities,HttpStatus.OK);
	}
	
	/*
	 * Get /api/v1/cities/{id}
	 * Purpose: Fetch details of a specific city using its unique primary key Id.
	 */
	
	@GetMapping("/{id}")
	public ResponseEntity<City> getCityById(@PathVariable Long id)
	{
		City city=cityService.getCityById(id);
		return new ResponseEntity<>(city ,HttpStatus.OK);
	}
	
}
