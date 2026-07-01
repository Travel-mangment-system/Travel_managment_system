package com.travelmanagement.backend.services;

import java.time.LocalDate;
import java.util.List;

import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleRequest;
import com.travelmanagement.backend.dtos.ScheduleDto.ScheduleResponse;
import com.travelmanagement.backend.dtos.ScheduleDto.SeatLayoutResponse;

public interface ScheduleService {

	ScheduleResponse createSchedule(ScheduleRequest request);
	List<ScheduleResponse> searchSchedules(Long sourceId, Long destinationId, LocalDate date);
    SeatLayoutResponse getSeatLayout(Long scheduleId);
	void cancelSchedule(Long scheduleId);
}
