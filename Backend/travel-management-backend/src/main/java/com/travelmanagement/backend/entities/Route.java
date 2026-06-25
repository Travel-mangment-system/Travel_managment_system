package com.travelmanagement.backend.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "routes")
public class Route {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="route_id")
	private Long id;
	@Column(name="start_location",nullable = false,length = 100)
	private String startLocation;
	@Column(name="end_location",nullable = false, length = 100)
	private String endLocation;
	@Column(name="distance_km",nullable = false,precision = 8, scale = 2)
	private BigDecimal distanceKm;
	@Column(name="base_fare",nullable = false)
	private Double baseFare;
	@OneToMany(mappedBy = "route",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
	private List<Bus>buses = new ArrayList<>();
	@OneToMany(mappedBy = "route",cascade = CascadeType.ALL,orphanRemoval = true, fetch = FetchType.LAZY)
	@OrderBy("stopOrder ASC")
	private List<BusStop> stops = new ArrayList<>();
}
