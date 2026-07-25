//package com.travelmanagement.backend.services;
//
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.travelmanagement.backend.dtos.HolidayPackageSaveDTO;
//import com.travelmanagement.backend.entities.HolidayPackage;
//import com.travelmanagement.backend.entities.PackageStatus;
//import com.travelmanagement.backend.repositories.BusRepository;
//import com.travelmanagement.backend.repositories.HolidayPackageRepository;
//
//
//import lombok.RequiredArgsConstructor;
//
//
//@Service
//@RequiredArgsConstructor
//@Transactional(readOnly=true)
//
//public class HolidayPackageServiceImpl implements HolidayPackageService{
//	
//	private final HolidayPackageRepository packageRepository;
//	private final BusRepository busRepository;
//	
//	@Override
//	@Transactional
//	public HolidayPackage createPackage(HolidayPackageSaveDTO dto) {
//		HolidayPackage newPackage = new HolidayPackage();
//		
//		mapDtoToEntity(dto, newPackage);
//		
//		newPackage.setStatus(PackageStatus.ACTIVE);
//		
//		return packageRepository.save(newPackage);
//	}
//
//	private void mapDtoToEntity(HolidayPackageSaveDTO dto, HolidayPackage entity) {
//		entity.setTitle(dto.getTitle());
//		entity.setDescription(dto.getDescription());
//		entity.setBasePrice(dto.getBasePrice());
//		entity.setDurationDays();
//	}
//	
//}
