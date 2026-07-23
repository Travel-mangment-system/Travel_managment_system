package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.HolidayPackage;



public interface HolidayPackageRepository extends JpaRepository<HolidayPackage, Long> {

}
