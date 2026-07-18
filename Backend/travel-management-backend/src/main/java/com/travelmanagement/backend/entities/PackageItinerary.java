package com.travelmanagement.backend.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class PackageItinerary {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long itineraryId;
	
	private int dayNumber;
	private String dayTitle;
	private String hotelName;
	private String mealsIncluded;
	@ManyToOne
	@JoinColumn(name = "holiday_package_id")
	private HolidayPackage holidayPackage;
	@OneToMany(mappedBy = "itinerary",cascade=CascadeType.ALL)
	private List<DailyActivity> activities;
}
