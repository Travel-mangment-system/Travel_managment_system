package com.travelmanagement.backend.entities;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
/*
 *     class Bus {
        +Long id
        +String busNumber
        +String busName
        +BusType busType
        +Integer totalSeats
        +String amenities
        +BusStatus status
    }*/
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "bus")
public class Bus {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bus_id")
	private Long id;
	
	@Column(name = "bus_number")
	private String busNumber;
	
	@Column(name = "bus_name")
	private String busName;
	
	@Column(name = "bus_type")
	@Enumerated(EnumType.STRING)
	private BusType busType;
	
	@Column(name = "total_seats")
	private int totalSeats;
	
	@Column(name = "amenities")
	private String amenities;
	
	@Column(name = "bus_status")
	@Enumerated(EnumType.STRING)
	private BusStatus status;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "provider_id", nullable = false)
	private BusProvider busProvider;
	
	
	
//	@OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
//	private List<BusSchedule> busSchedules;
//	
//	@OneToMany(mappedBy ="bus", cascade = CascadeType.ALL)
//	private List<Review> reviews;
}
