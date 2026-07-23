package com.travelmanagement.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.dtos.DailyActivityRequest;
import com.travelmanagement.backend.entities.DailyActivity;
import com.travelmanagement.backend.entities.PackageItinerary;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, Long> {

}
