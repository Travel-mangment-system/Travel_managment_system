package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.PackageItinerary;

public interface PackageItineraryRepository extends JpaRepository<PackageItinerary, Long> {

}
