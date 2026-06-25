package com.travelmanagement.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.ManyToAny;


import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="bus_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"bus","route"})

public class BusSchedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="departure_datetime",nullable = false)
	private LocalDateTime departureDatetime;
	
	@Column(name="arrival_datetime",nullable = false)
	private LocalDateTime arrivalDatetime;
	
	@Column(nullable = false,precision = 10,scale = 2)
	private BigDecimal fare;
	
	@Column(name="available_seats",nullable = false)
	private Integer availableSeats;
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ScheduleStatus status;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="bus_id",nullable = false)
	private Bus bus;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="route_id",nullable = false)
	private Route route;
	
	
	
	
	
}
