package com.travelmanagement.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.travelmanagement.backend.entities.HolidayPackage;
import com.travelmanagement.backend.entities.PackageStatus;



public interface HolidayPackageRepository extends JpaRepository<HolidayPackage, Long> {

	
	
	List<HolidayPackage> findByStatus(PackageStatus status);

    @Query("""
           SELECT hp
           FROM HolidayPackage hp
           WHERE hp.packageId = :packageId
           """)
    HolidayPackage findCustomerPackageById(
            @Param("packageId") Long packageId);
}