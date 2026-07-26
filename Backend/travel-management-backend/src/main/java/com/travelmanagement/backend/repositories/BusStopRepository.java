package com.travelmanagement.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.BusStop;

public interface BusStopRepository extends JpaRepository<BusStop, Long> {

	List<BusStop> findByRouteIdOrderByStopOrderAsc(Long routeId);
	int countByRouteId(Long routeId);
}
