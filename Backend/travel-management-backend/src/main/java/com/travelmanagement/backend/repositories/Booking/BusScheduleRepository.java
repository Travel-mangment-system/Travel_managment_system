package com.travelmanagement.backend.repositories.Booking;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.BusSchedule;
import com.travelmanagement.backend.entities.ScheduleStatus;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long>{

	List<BusSchedule> findByBusIdAndDepartureDatetimeAfter(Long busId, LocalDateTime currentTime);
	List<BusSchedule> findBySourceCityIgnoreCaseAndDestinationCityIgnoreCaseAndStatus(
            String sourceCity, 
            String destinationCity, 
            ScheduleStatus status
    );
}
