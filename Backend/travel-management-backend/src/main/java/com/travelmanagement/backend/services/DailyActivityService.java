package com.travelmanagement.backend.services;

import java.util.List;

import com.travelmanagement.backend.dtos.DailyActivityRequest;
import com.travelmanagement.backend.entities.PackageItinerary;

public interface DailyActivityService {

	void addActivities(PackageItinerary itinerary,List<DailyActivityRequest> requests);
}
