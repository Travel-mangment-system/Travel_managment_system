package com.travelmanagement.backend.repositories;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.travelmanagement.backend.entities.HolidayPackage;

@Repository
public interface HolidayPackageRepository extends JpaRepository<HolidayPackage, Long> {

	@Query("SELECT h FROM HolidayPackage h WHERE h.status = 'ACTIVE' " +
	"AND (:destination IS NULL OR h.destinationCity = :destination) " +
	"AND (:minPrice IS NULL OR h.basePrice >= :minPrice) " +
	"AND (:maxPrice IS NULL OR h.basePrice <= :maxPrice)")
	Page<HolidayPackage> findActiveWithFilters(
			@Param("destination") String destination,
			@Param("minPrice") BigDecimal minPrice,
			@Param("maxPrice") BigDecimal maxPrice,
			Pageable pageable);

}