package com.travelmanagement.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusStatus;

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
	
	List<Bus> findByRoute_StartCity_CityNameIgnoreCaseAndRoute_EndCity_CityNameIgnoreCaseAndStatus(
            String startCityName, 
            String endCityName, 
            BusStatus status
    );
//>>>>>>> b38d24e0f360eef842d922d085a7a7ecb2e746ea
}
