package com.travelmanagement.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name= "holiday_package")
public class HolidayPackage {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "package_id")
	private Long packageId;
	
	@Column(name = "title",nullable = false)
	private String title;
	
	@Column(name= "description", length = 1000)
	private String description;
	
	@Column(name= "base_price", nullable = false)
	private BigDecimal basePrice;
	
	@Column(name = "duration_days")
	private Integer durationDays;
	
	@Column(name = "duration_nights")
	private Integer durationNights;
	
	@Column(name = "destination_city")
	private String destinationCity;
	
	@Column(name = "departure_datetime")
	private LocalDateTime departureDatetime;
	
	@Column(name= "return_datetime")
	private LocalDateTime returnDatetime;
	
	@Column(name= "total_capacity")
	private Integer totalCapacity;
	
	@Column(name= "available_spots")
	private Integer availableSpots;
	
	@Enumerated(EnumType.STRING)
	@Column(name= "package_status")
	private PackageStatus status;
	
	@Column(name= "created_at")
	private LocalDateTime createdAt;
	
	@OneToOne
	@JoinColumn(name= "assigned_bus_id",unique = true)
	private Bus assignedBus;
	
	@OneToMany(mappedBy = "holidayPackage", cascade = CascadeType.ALL)
	private List<PackageBooking> packageBookings;

	
	
}
