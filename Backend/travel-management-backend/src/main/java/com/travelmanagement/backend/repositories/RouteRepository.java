package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {

	String findByStartCityCityName(Route scheduleRoute);

}
