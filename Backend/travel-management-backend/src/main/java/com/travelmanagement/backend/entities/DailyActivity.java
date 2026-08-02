package com.travelmanagement.backend.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Table(name="Daily_Activity")
public class DailyActivity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long activityId;
	private String timeOfDay;
	private String description;
	@ManyToOne
	@JoinColumn(name="package_itinerary_id")
	private PackageItinerary itinerary;
}