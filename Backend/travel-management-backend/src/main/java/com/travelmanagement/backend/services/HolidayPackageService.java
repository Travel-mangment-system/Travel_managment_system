package com.travelmanagement.backend.services;

import java.math.BigDecimal;

import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageStatus;

import jakarta.validation.Valid;

public interface HolidayPackageService {

	HolidayPackageResponse createPackage(HolidayPackageRequest request);

	HolidayPackageResponse updatePackage(Long packageId, @Valid HolidayPackageRequest request);

	void updatePackage(Long packageId, PackageStatus status);
	
	Page<HolidayPackage> searchActivePackages(String destination, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
	
	HolidayPackage getPackageById(Long id);
}