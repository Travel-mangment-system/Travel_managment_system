package com.travelmanagement.backend.repositories.Booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long>{

	List<Seat> findByBusId(Long busId);

}
