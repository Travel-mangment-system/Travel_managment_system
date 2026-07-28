package com.travelmanagement.backend.services;

import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageStatus;

import jakarta.validation.Valid;

public interface HolidayPackageService {

	HolidayPackageResponse createPackage(
	        HolidayPackageRequest request,
	        MultipartFile image);

	HolidayPackageResponse updatePackage(Long packageId, @Valid HolidayPackageRequest request);

	void updatePackage(
	        Long packageId,
	        PackageStatus status);

	void deletePackage(Long packageId);
	List<HolidayPackage> getAllPackages();
}