package com.travelmanagement.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.HolidayPackageSaveDTO;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.services.HolidayPackageService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/admin/packages")
@RequiredArgsConstructor

public class AdminPackageController {

	private final HolidayPackageService packageService;
	
	@PostMapping
	public ResponseEntity<?> createPackage(@RequestBody HolidayPackageSaveDTO dto)
	{
		
		HolidayPackage createdPackage= packageService.createPackage(dto);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(createdPackage);
	}
	
	
	
	
}

