package com.travelmanagement.backend.services;

import org.springframework.stereotype.Service;

import com.travelmanagement.backend.CustomException.ResourceNotFoundException;
import com.travelmanagement.backend.dtos.PackageItineraryRequest;
import com.travelmanagement.backend.dtos.PackageItineraryResponse;
import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageItinerary;
import com.travelmanagement.backend.repositories.DailyActivityRepository;
import com.travelmanagement.backend.repositories.HolidayPackageRepository;
import com.travelmanagement.backend.repositories.PackageItineraryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
@Transactional
public class PackageItineraryServiceImpl implements PackageItineraryService{

	private final HolidayPackageRepository holidayPackageRepository;
	private final PackageItineraryRepository packageItineraryRepository;
	private final DailyActivityService dailyActivityService;
	@Override
	public PackageItineraryResponse addItinerary(Long packageId, PackageItineraryRequest request) {
		HolidayPackage holidayPackage= holidayPackageRepository.findById(packageId).orElseThrow(()-> new ResourceNotFoundException("Holiday Package note found with id :"+packageId));
		
		PackageItinerary itinerary = new PackageItinerary();
		
		itinerary.setDayNumber(request.getDayNumber());
		itinerary.setDayTitle(request.getDayTitle());
		itinerary.setHotelName(request.getHotelName());
		itinerary.setMealsIncluded(request.getMealsIncluded());
		itinerary.setHolidayPackage(holidayPackage);
		
		PackageItinerary savedItinerary = packageItineraryRepository.save(itinerary);
		
		//SAve activities of this day
		
		dailyActivityService.addActivities(savedItinerary, request.getActivities());
		
		
		PackageItineraryResponse response = new PackageItineraryResponse();
		response.setItineraryId(savedItinerary.getItineraryId());
		response.setDayNumber(savedItinerary.getDayNumber());
		response.setDayTitle(savedItinerary.getDayTitle());
		response.setHotelName(savedItinerary.getHotelName());
		response.setMealsIncluded(savedItinerary.getMealsIncluded());

		return response;
	}

}
