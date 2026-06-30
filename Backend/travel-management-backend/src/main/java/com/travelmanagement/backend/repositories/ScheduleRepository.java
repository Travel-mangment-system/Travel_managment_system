package com.travelmanagement.backend.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.travelmanagement.backend.entities.BusSchedule;

public interface ScheduleRepository extends JpaRepository<BusSchedule, Long> {

	@Query("SELECT COUNT(s) FROM BusSchedule s WHERE s.bus.id = :busId "+"AND (s.departureDatetime < :newArrival AND s.arrivalDatetime > :newDeparture)")
	int countOverlappingSchedules(@Param("busId")Long busId,@Param("newDeparture")LocalDateTime departureDatetime,@Param("newArrival")LocalDateTime arrivalDatetime);

	@Query("SELECT s FROM BusSchedule s WHERE s.route.startCity.id = :sourceId " +
	           "AND s.route.endCity.id = :destId " +
	           "AND s.departureDatetime >= :startOfDay AND s.departureDatetime < :endOfDay")
	List<BusSchedule> findByRouteAndDate(Long sourceId, Long destinationId, LocalDateTime startOfDay,
			LocalDateTime endOfDay);

}
