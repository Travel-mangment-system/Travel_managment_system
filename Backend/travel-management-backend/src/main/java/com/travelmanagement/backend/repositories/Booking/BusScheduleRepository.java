package com.travelmanagement.backend.repositories.Booking;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.BusSchedule;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long>{

}
