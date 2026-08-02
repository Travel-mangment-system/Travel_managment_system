package com.travelmanagement.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusProvider;

public interface BusRepository extends JpaRepository<Bus, Long> {

//=======
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import com.travelmanagement.backend.entities.Bus;
//
//@Repository
//public interface BusRepository extends JpaRepository<Bus, Long>{
//
//	/*
//	 * custom query method : gets the entire fleet list for a specific travel company ID
//	 */
	List<Bus> findByBusProviderId(Long providerId);
//>>>>>>> b38d24e0f360eef842d922d085a7a7ecb2e746ea

	@Query("""
		    SELECT DISTINCT b
		    FROM Bus b
		    WHERE b.status = 'ACTIVE'
		    AND NOT EXISTS (
		        SELECT bs
		        FROM BusSchedule bs
		        WHERE bs.bus = b
		        AND bs.status = 'SCHEDULED'
		    )
		""")
		List<Bus> findAvailableBuses();
}
