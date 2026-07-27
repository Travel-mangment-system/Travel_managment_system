package com.travelmanagement.backend.dtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PackageItineraryResponse {

	  private Long itineraryId;

	    private Integer dayNumber;

	    private String dayTitle;

	    private String hotelName;

	    private String mealsIncluded;

	    private List<DailyActivityResponse> activities;
}