package com.travelmanagement.backend.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
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
