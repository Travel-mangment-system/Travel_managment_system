package com.travelmanagement.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PackageTraveler {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long packageTravelerId;
	private String fullName;
	private int age;
	private String gender;
	private PackageBooking packageBooking;
	
}
