package com.travelmanagement.backend.repositories.Booking;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.travelmanagement.backend.entities.SeatLock;

public interface SeatLockRepository extends JpaRepository<SeatLock, Long>{
	List<SeatLock> findByLockReference(String lockReference);
	
	List<SeatLock> findAllBySchedule_ScheduleId(Long scheduleId);

	@Query("SELECT sl.seat.id FROM SeatLock sl WHERE sl.schedule.scheduleId = :scheduleId AND sl.expiresAt > :currentTime")
	List<Long> findActiveLockedSeatIds(@Param("scheduleId") Long scheduleId, @Param("currentTime") LocalDateTime currentTime);
}
