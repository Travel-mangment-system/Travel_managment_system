package com.travelmanagement.backend.repositories.Booking;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.User;

public interface BookingRepository extends JpaRepository<Booking, Long>{
	List<Booking> findByUserId(Long userId);

	List<Booking> findAllByUserId(Long userId);

	
}
