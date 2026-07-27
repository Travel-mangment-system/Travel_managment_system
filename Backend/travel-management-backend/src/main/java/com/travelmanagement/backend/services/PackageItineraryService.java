package com.travelmanagement.backend.services;

import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.PackageItineraryRequest;
import com.travelmanagement.backend.dtos.PackageItineraryResponse;


public interface PackageItineraryService {
	 PackageItineraryResponse addItinerary(Long packageId,
	            PackageItineraryRequest request);
}