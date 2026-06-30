package com.travelmanagement.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelmanagement.backend.entities.Bus;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long>{

	/*
	 * custom query method : gets the entire fleet list for a specific travel company ID
	 */
	List<Bus> findByBusProviderId(Long providerId);
}
