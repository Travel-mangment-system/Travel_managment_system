package com.travelmanagement.backend.services;



import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.travelmanagement.backend.dtos.HolidayPackageSaveDTO;
import com.travelmanagement.backend.entities.HolidayPackage;

public interface HolidayPackageService {
	//Admin Create
	HolidayPackage createPackage(HolidayPackageSaveDTO dto);
	
	//Admin Update
	HolidayPackage updatePackage(Long id, HolidayPackageSaveDTO dto);
	
	//
	void deactivatePackage(Long id);
	
	//Fetch all
	List<HolidayPackage> getAllPackages();
	
	//Fetch single package by ID
	HolidayPackage getPackageById(Long id);
	
	//handles customers catalog browsing with optional parameters
	List<HolidayPackage> searchActivePackages(String destination,BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
	
}

