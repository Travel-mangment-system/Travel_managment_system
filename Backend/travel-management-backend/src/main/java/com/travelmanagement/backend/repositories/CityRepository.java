package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.City;

public interface CityRepository extends JpaRepository<City, Long> {

}
