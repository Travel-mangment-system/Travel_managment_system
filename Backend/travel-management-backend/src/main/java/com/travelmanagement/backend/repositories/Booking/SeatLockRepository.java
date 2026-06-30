package com.travelmanagement.backend.repositories.Booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.SeatLock;

public interface SeatLockRepository extends JpaRepository<SeatLock, Long>{
	List<SeatLock> findByLockReference(String lockReference);
	
	List<SeatLock> findAllBySchedule_ScheduleId(Long scheduleId);
}
