package com.travelmanagement.backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.CustomException.ResourceNotFoundException;
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

	@Override
	public HolidayPackageResponse createPackage(HolidayPackageRequest request) {
		
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
    public void deletePackage(Long packageId) {
        // 2. Fetch the package
        HolidayPackage holidayPackage = holidayPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id : " + packageId));

        // 3. Prevent cancelling if the tour has already started
        if (holidayPackage.getDepartureDatetime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot cancel a package tour that has already departed.");
        }

        // 4. Update Package Status
        holidayPackage.setStatus(PackageStatus.CANCELLED);
        
        // 5. Release the assigned bus back to ACTIVE pool
        Bus bus = holidayPackage.getAssignedBus();
        if (bus != null) {
            bus.setStatus(BusStatus.ACTIVE);
            busRepository.save(bus);
        }
        holidayPackageRepository.save(holidayPackage);

        // 6. Find all CONFIRMED bookings for this specific package
        List<PackageBooking> activeBookings = packageBookingRepository
                .findByHolidayPackage_PackageIdAndBookingStatus(packageId, BookingStatus.CONFIRMED);

        // 7. Cancel bookings and issue 100% refunds using our unified refund service
        for (PackageBooking booking : activeBookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED);
            
            try {
                // Call the unified Refund Service passing "PACKAGE" and "ADMIN" to trigger 100% refund
                refundService.cancelAndRefund(booking.getPackageBookingId(), "PACKAGE", "ADMIN"); 
            } catch (Exception e) {
                System.err.println("Failed to refund package booking " + booking.getPackageBookingId() + ": " + e.getMessage());
            }
            
            packageBookingRepository.save(booking);
        }
	}
}