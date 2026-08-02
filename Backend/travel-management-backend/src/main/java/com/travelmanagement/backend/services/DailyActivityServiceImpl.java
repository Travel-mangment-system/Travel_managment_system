package com.travelmanagement.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.DailyActivityRequest;
import com.travelmanagement.backend.entities.DailyActivity;
import com.travelmanagement.backend.entities.PackageItinerary;
import com.travelmanagement.backend.repositories.DailyActivityRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DailyActivityServiceImpl implements DailyActivityService {

	private final DailyActivityRepository dailyActivityRepository;

	@Override
	public void addActivities(PackageItinerary itinerary, List<DailyActivityRequest> requests) {
		
		for(DailyActivityRequest request : requests)
		{
			DailyActivity activity =new DailyActivity();
			
			activity.setTimeOfDay(request.getTimeOfDay());
			activity.setDescription(request.getDescription());
			activity.setItinerary(itinerary);
			dailyActivityRepository.save(activity);
		}
		
	}
	
	
}