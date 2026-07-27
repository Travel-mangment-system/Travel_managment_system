package com.travelmanagement.backend.services;

import org.jspecify.annotations.Nullable;

import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.entities.PackageStatus;

import jakarta.validation.Valid;

public interface HolidayPackageService {

	HolidayPackageResponse createPackage(HolidayPackageRequest request);

	HolidayPackageResponse updatePackage(Long packageId, @Valid HolidayPackageRequest request);

	void updatePackage(
	        Long packageId,
	        PackageStatus status);
}