package com.travelmanagement.backend.services;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageStatus;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HolidayPackageServiceImpl implements HolidayPackageService {
	
	private final HolidayPackageRepository packageRepository;
	

	@Override
	@Transactional
	public HolidayPackageResponse createPackage(HolidayPackageRequest request) {
		HolidayPackage newPackage = new HolidayPackage();
		mapRequestToEntity(request, newPackage);
		newPackage.setStatus(PackageStatus.ACTIVE);
		
		HolidayPackage savedPackage = packageRepository.save(newPackage);
		return mapEntityToResponse(savedPackage);
	}

	@Override
	@Transactional
	public HolidayPackageResponse updatePackage(Long packageId, HolidayPackageRequest request) {
		HolidayPackage existingPackage = getPackageById(packageId);
		mapRequestToEntity(request, existingPackage);
		
		HolidayPackage updatedPackage = packageRepository.save(existingPackage);
		return mapEntityToResponse(updatedPackage);
	}

	@Override
	@Transactional
	public void updatePackage(Long packageId, PackageStatus status) {
		HolidayPackage existingPackage = getPackageById(packageId);
		existingPackage.setStatus(status);
		packageRepository.save(existingPackage);
	}

	
	
	@Override
	public HolidayPackage getPackageById(Long id) {
		return packageRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Holiday Package not found with ID: " + id));
	}

	@Override
	public Page<HolidayPackage> searchActivePackages(String destination, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
		return packageRepository.findActiveWithFilters(destination, minPrice, maxPrice, pageable);
	}
	
	
	
	private void mapRequestToEntity(HolidayPackageRequest request, HolidayPackage entity) {
		// Note: Adjust these getters based on the exact fields Aditya put in HolidayPackageRequest!
		entity.setTitle(request.getTitle());
		entity.setDescription(request.getDescription());
		entity.setBasePrice(request.getBasePrice());
		entity.setDurationDays(request.getDurationDays());
		entity.setDurationNights(request.getDurationNights());
		entity.setDestinationCity(request.getDestinationCity());
	}
	
	private HolidayPackageResponse mapEntityToResponse(HolidayPackage entity) {
		
		HolidayPackageResponse response = new HolidayPackageResponse();
		response.setPackageId(entity.getPackageId());
		response.setTitle(entity.getTitle());
		response.setBasePrice(entity.getBasePrice());
		response.setStatus(entity.getStatus());
		return response;
	}
}