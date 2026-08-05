package com.travelmanagement.backend.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.travelmanagement.backend.CustomException.ResourceNotFoundException;
import com.travelmanagement.backend.dtos.CustomerHomePackageDto;
import com.travelmanagement.backend.dtos.CustomerPackageDetailsDto;
import com.travelmanagement.backend.dtos.HolidayPackageRequest;
import com.travelmanagement.backend.dtos.HolidayPackageResponse;
import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.Bus;
import com.travelmanagement.backend.entities.BusSchedule;
import com.travelmanagement.backend.entities.BusStatus;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageBooking;
import com.travelmanagement.backend.entities.PackageStatus;
import com.travelmanagement.backend.entities.ScheduleStatus;
import com.travelmanagement.backend.repositories.BusRepository;
import com.travelmanagement.backend.repositories.BusStopRepository;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;
import com.travelmanagement.backend.repositories.PackageBookingRepository;
import com.travelmanagement.backend.repositories.PackageItineraryRepository;
import com.travelmanagement.backend.repositories.RouteRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class HolidayPackageServiceImpl implements HolidayPackageService {
	
	private final HolidayPackageRepository holidayPackageRepository;
	private final BusRepository busRepository;
	private final PackageBookingRepository packageBookingRepository;
    private final RefundService refundService;
    private final PackageItineraryRepository packageItineraryRepository;

	@Override
	public HolidayPackageResponse createPackage(
	        HolidayPackageRequest request,
	        MultipartFile image) {
		
		Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id : " + request.getBusId())); 
		
        if ((bus.getStatus() != BusStatus.ACTIVE) || (bus.getStatus() == BusStatus.ON_TOUR)) {
			List<BusSchedule> busSchedules = bus.getBusSchedules();
			for(BusSchedule b : busSchedules) {
				if(b.getStatus() == ScheduleStatus.SCHEDULED) {
					throw new IllegalStateException("Selected bus is already assigned to another package.");
				}
			}
        }
        
		HolidayPackage holidayPackage = new HolidayPackage();
		
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
		
		if (image != null && !image.isEmpty()) {

		    try {

		        String uploadDir = "uploads/packages/";

		        Files.createDirectories(Paths.get(uploadDir));

		        String fileName =
		                UUID.randomUUID()
		                + "_"
		                + image.getOriginalFilename();

		        Path filePath =
		                Paths.get(uploadDir, fileName);

		        Files.copy(
		                image.getInputStream(),
		                filePath,
		                StandardCopyOption.REPLACE_EXISTING);

		        holidayPackage.setImageUrl(fileName);

		    } catch (IOException e) {

		        throw new RuntimeException("Image upload failed", e);

		    }

		}
		
		bus.setStatus(BusStatus.ON_TOUR);
		busRepository.save(bus);
		
		// Save Package
		HolidayPackage savedpackage = holidayPackageRepository.save(holidayPackage);
		
        // Prepare Response
		HolidayPackageResponse response = new HolidayPackageResponse();
		response.setPackageId(savedpackage.getPackageId());
		response.setTitle(savedpackage.getTitle());
		response.setBasePrice(savedpackage.getBasePrice());
		response.setStatus(savedpackage.getStatus());
		response.setAvailableSpots(savedpackage.getAvailableSpots());
		response.setImageUrl(savedpackage.getImageUrl());
		return response;
	}

	@Override
	public HolidayPackageResponse updatePackage(Long packageId, @Valid HolidayPackageRequest request) {
		HolidayPackage holidayPackage = holidayPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id : " + packageId));
		
		holidayPackage.setTitle(request.getTitle());
	    holidayPackage.setDescription(request.getDescription());
	    holidayPackage.setBasePrice(request.getBasePrice());
	    holidayPackage.setDurationDays(request.getDurationDays());
	    holidayPackage.setDurationNights(request.getDurationNights());
	    holidayPackage.setDestinationCity(request.getDestinationCity());
	    holidayPackage.setDepartureDatetime(request.getDepartureDatetime());
	    holidayPackage.setReturnDatetime(request.getReturnDatetime());
	    holidayPackage.setTotalCapacity(request.getTotalCapacity());
	    
	    HolidayPackage updated = holidayPackageRepository.save(holidayPackage);
	    
	    HolidayPackageResponse response = new HolidayPackageResponse();
	    response.setPackageId(updated.getPackageId());
	    response.setTitle(updated.getTitle());
	    response.setBasePrice(updated.getBasePrice());
	    response.setAvailableSpots(updated.getAvailableSpots());
	    response.setStatus(updated.getStatus());
	    response.setImageUrl(updated.getImageUrl());
		return response;
	}

	@Override
	public void updatePackage(Long packageId, PackageStatus status) {
		HolidayPackage holidayPackage = holidayPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));
		
		holidayPackage.setStatus(status);
		
        // If package is cancelled, release the bus back to ACTIVE status
        if (status == PackageStatus.CANCELLED) {
			Bus bus = holidayPackage.getAssignedBus();
			if(bus != null) {
				bus.setStatus(BusStatus.ACTIVE);
				busRepository.save(bus);
			}
		}
		holidayPackageRepository.save(holidayPackage);
	}
	@Override
	@Transactional
	public void deletePackage(Long packageId) {

	    // 1. Fetch the package
	    HolidayPackage holidayPackage = holidayPackageRepository.findById(packageId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Package not found with id : " + packageId));

	    // 2. Prevent deletion if the tour has already started
	    if (holidayPackage.getDepartureDatetime().isBefore(LocalDateTime.now())) {
	        throw new RuntimeException(
	                "Cannot delete a package that has already departed.");
	    }

	    // 3. Release the assigned bus
	    Bus bus = holidayPackage.getAssignedBus();

	    if (bus != null) {
	        bus.setStatus(BusStatus.ACTIVE);
	        busRepository.save(bus);
	    }

	    // 4. Get all confirmed bookings
	    List<PackageBooking> activeBookings =
	            packageBookingRepository
	                    .findByHolidayPackage_PackageIdAndBookingStatus(
	                            packageId,
	                            BookingStatus.CONFIRMED);

	    // 5. Cancel bookings and process refund
	    for (PackageBooking booking : activeBookings) {

	        booking.setBookingStatus(BookingStatus.CANCELLED);

	        try {

	            refundService.cancelAndRefund(
	                    booking.getPackageBookingId(),
	                    "PACKAGE",
	                    "ADMIN"
	            );

	        } catch (Exception e) {

	            System.err.println(
	                    "Failed to refund booking "
	                            + booking.getPackageBookingId()
	                            + " : "
	                            + e.getMessage()
	            );

	        }

	        packageBookingRepository.save(booking);
	    }

	    // 6. Delete the package permanently
	 // Delete all itinerary records first
	    packageItineraryRepository.deleteByHolidayPackage_PackageId(packageId);

	    // Now delete the package
	    holidayPackageRepository.delete(holidayPackage);
	}
	// Add this method inside HolidayPackageServiceImpl
	@Override
	public List<HolidayPackage> getAllPackages() {
	    // Fetches all packages from the database
	    return holidayPackageRepository.findAll();
	}
	// ===========================================================
	// CUSTOMER HOME PAGE
	// ===========================================================

	@Override
	public List<CustomerHomePackageDto> getCustomerHomePackages() {

	    List<HolidayPackage> packages =
	            holidayPackageRepository.findByStatus(PackageStatus.ACTIVE);

	    List<CustomerHomePackageDto> response = new ArrayList<>();
	    LocalDateTime now = LocalDateTime.now();

	    for (HolidayPackage pkg : packages) {
	        
	        // Only add to the list if the departure date is in the future
	        if (pkg.getDepartureDatetime() != null && pkg.getDepartureDatetime().isAfter(now)) {
	            CustomerHomePackageDto dto = new CustomerHomePackageDto();

	            dto.setPackageId(pkg.getPackageId());
	            dto.setTitle(pkg.getTitle());
	            dto.setDestinationCity(pkg.getDestinationCity());
	            dto.setBasePrice(pkg.getBasePrice());
	            dto.setDurationDays(pkg.getDurationDays());
	            dto.setDurationNights(pkg.getDurationNights());
	            dto.setAvailableSpots(pkg.getAvailableSpots());
	            dto.setImageUrl(pkg.getImageUrl());

	            response.add(dto);
	        }

	    }

	    return response;
	}


	// ===========================================================
	// CUSTOMER PACKAGE DETAILS
	// ===========================================================

	@Override
	public CustomerPackageDetailsDto getCustomerPackageDetails(Long packageId) {

	    HolidayPackage pkg =
	            holidayPackageRepository.findCustomerPackageById(packageId);

	    if (pkg == null) {

	        throw new RuntimeException("Package not found");

	    }

	    // Throw an error if the user tries to access a package that has already departed
	    if (pkg.getDepartureDatetime() != null && pkg.getDepartureDatetime().isBefore(LocalDateTime.now())) {
	        throw new RuntimeException("This package has already departed and is no longer available.");
	    }

	    CustomerPackageDetailsDto dto = new CustomerPackageDetailsDto();

	    dto.setPackageId(pkg.getPackageId());
	    dto.setTitle(pkg.getTitle());
	    dto.setDescription(pkg.getDescription());
	    dto.setImageUrl(pkg.getImageUrl());
	    dto.setDestinationCity(pkg.getDestinationCity());
	    dto.setBasePrice(pkg.getBasePrice());
	    dto.setDurationDays(pkg.getDurationDays());
	    dto.setDurationNights(pkg.getDurationNights());
	    dto.setAvailableSpots(pkg.getAvailableSpots());
	    dto.setDepartureDatetime(pkg.getDepartureDatetime());
	    dto.setReturnDatetime(pkg.getReturnDatetime());

	    return dto;
	}
}