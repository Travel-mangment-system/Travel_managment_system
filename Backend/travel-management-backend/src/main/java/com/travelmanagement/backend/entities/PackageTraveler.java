package com.travelmanagement.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "Package_Traveler")
public class PackageTraveler {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long packageTravelerId;
	private String fullName;
	private int age;
	private Gender gender;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="package_booking_id", nullable = false)
	private PackageBooking packageBooking;
	
}
