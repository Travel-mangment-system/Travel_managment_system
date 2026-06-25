package com.travelmanagement.backend.entities.bus;

//import org.springframework.data.jpa.repository.query.EqlParser.General_derived_pathContext;

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
@Table(name="booked_seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"booking","seat"})

public class BookedSeat {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="passenger_name",nullable = false)
	private String passengerName;
	
	@Column(name="passenger_age",nullable = false)
	private Integer passengerAge;
	
	@Enumerated(EnumType.STRING)
	@Column(name="passenger_gender",nullable = false)
	private Gender passengerGender;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="booking_id",nullable = false)
	private Booking booking;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="seat_id",nullable = false)
	private Seat seat;
	

}
