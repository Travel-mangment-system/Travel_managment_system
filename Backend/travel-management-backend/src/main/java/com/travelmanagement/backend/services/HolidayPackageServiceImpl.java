package com.travelmanagement.backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.CustomException.ResourceNotFoundException;
import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusSchedule;
import com.travelmanagement.backend.entities.BusStatus;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageStatus;
import com.travelmanagement.backend.entities.ScheduleStatus;
import com.travelmanagement.backend.repositories.BusRepository;
import com.travelmanagement.backend.repositories.BusStopRepository;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;
import com.travelmanagement.backend.repositories.RouteRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class HolidayPackageServiceImpl implements HolidayPackageService {
	private final HolidayPackageRepository holidayPackageRepository;
	private final BusRepository busRepository;
	@Override
	public HolidayPackageResponse createPackage(HolidayPackageRequest request) {
		
		Bus bus=busRepository.findById(request.getBusId()).orElseThrow(()->new ResourceNotFoundException("Bus not found with id : " + request.getBusId())); 
		if((bus.getStatus()!=BusStatus.ACTIVE)|| (bus.getStatus()==BusStatus.ON_TOUR))
		{
			List<BusSchedule> busSchedules=bus.getBusSchedules();
			for(BusSchedule b : busSchedules)
			{
				if(b.getStatus()==ScheduleStatus.SCHEDULED)
				{
					throw new IllegalStateException(
		                    "Selected bus is already assigned to another package.");
				}
			}
        }
		HolidayPackage holidayPackage=new HolidayPackage();
		
//<<<<<<< HEAD
//		HolidayPackage updatedPackage = packageRepository.save(existingPackage);
//		return mapEntityToResponse(updatedPackage);
//	}
//
//	@Override
//	@Transactional
//	public void updatePackage(Long packageId, PackageStatus status) {
//		HolidayPackage existingPackage = getPackageById(packageId);
//		existingPackage.setStatus(status);
//		packageRepository.save(existingPackage);
//	}
//
//	
//	
//	@Override
//	public HolidayPackage getPackageById(Long id) {
//		return packageRepository.findById(id)
//				.orElseThrow(() -> new RuntimeException("Holiday Package not found with ID: " + id));
//	}
//
//	@Override
//	public Page<HolidayPackage> searchActivePackages(String destination, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
//		return packageRepository.findActiveWithFilters(destination, minPrice, maxPrice, pageable);
//	}
//	
//	
//	
//	private void mapRequestToEntity(HolidayPackageRequest request, HolidayPackage entity) {
//		entity.setTitle(request.getTitle());
//		entity.setDescription(request.getDescription());
//		entity.setBasePrice(request.getBasePrice());
//		entity.setDurationDays(request.getDurationDays());
//		entity.setDurationNights(request.getDurationNights());
//		entity.setDestinationCity(request.getDestinationCity());
//	}
//	
//	private HolidayPackageResponse mapEntityToResponse(HolidayPackage entity) {
//=======
		holidayPackage.setTitle(request.getTitle());
		holidayPackage.setDescription(request.getDescription());
		holidayPackage.setBasePrice(request.getBasePrice());
		holidayPackage.setDurationDays(request.getDurationDays());
		holidayPackage.setDurationNights(request.getDurationNights());
		holidayPackage.setDestinationCity(request.getDestinationCity());
		holidayPackage.setDepartureDatetime(request.getDepartureDatetime());
		holidayPackage.setReturnDatetime(request.getReturnDatetime());
		holidayPackage.setTotalCapacity(request.getTotalCapacity());
		
		holidayPackage.setAvailableSpots(request.getTotalCapacity());
		
		holidayPackage.setStatus(PackageStatus.ACTIVE);
		
		holidayPackage.setCreatedAt(LocalDateTime.now());
		
		holidayPackage.setAssignedBus(bus);
		
		bus.setStatus(BusStatus.ON_TOUR);
		busRepository.save(bus);
		
		//Save Package
		HolidayPackage savedpackage= holidayPackageRepository.save(holidayPackage);
		//Prepare Response
		
		HolidayPackageResponse response=new HolidayPackageResponse();
		
		response.setPackageId(savedpackage.getPackageId());
		response.setTitle(savedpackage.getTitle());
		response.setBasePrice(savedpackage.getBasePrice());
		response.setStatus(savedpackage.getStatus());
		response.setAvailableSpots(savedpackage.getAvailableSpots());

		
		return response;
	}
	@Override
	public HolidayPackageResponse updatePackage(Long packageId, @Valid HolidayPackageRequest request) {
		HolidayPackage holidayPackage = holidayPackageRepository.findById(packageId).orElseThrow(()-> new ResourceNotFoundException("Package not found with id : "+packageId));
		
		holidayPackage.setTitle(request.getTitle());
	    holidayPackage.setDescription(request.getDescription());
	    holidayPackage.setBasePrice(request.getBasePrice());
	    holidayPackage.setDurationDays(request.getDurationDays());
	    holidayPackage.setDurationNights(request.getDurationNights());
	    holidayPackage.setDestinationCity(request.getDestinationCity());
	    holidayPackage.setDepartureDatetime(request.getDepartureDatetime());
	    holidayPackage.setReturnDatetime(request.getReturnDatetime());
	    holidayPackage.setTotalCapacity(request.getTotalCapacity());
	    
	    HolidayPackage updated= holidayPackageRepository.save(holidayPackage);
	    
	    HolidayPackageResponse response= new HolidayPackageResponse();
	    
	    response.setPackageId(updated.getPackageId());
	    response.setTitle(updated.getTitle());
	    response.setBasePrice(updated.getBasePrice());
	    response.setAvailableSpots(updated.getAvailableSpots());
	    response.setStatus(updated.getStatus());
	    
		return response;
	}
	@Override
	public void updatePackage(Long packageId, PackageStatus status) {
		HolidayPackage holidayPackage = holidayPackageRepository.findById(packageId).orElseThrow(()-> new ResourceNotFoundException("Package not found"));
		
		holidayPackage.setStatus(status);
		if(status == PackageStatus.CANCELLED)
		{
			Bus bus = holidayPackage.getAssignedBus();
			
			if(bus != null)
			{
				bus.setStatus(BusStatus.ACTIVE);
				
				busRepository.save(bus);
			}
		}
		holidayPackageRepository.save(holidayPackage);
		
	}
	
}