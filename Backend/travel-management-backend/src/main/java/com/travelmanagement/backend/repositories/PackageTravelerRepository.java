package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.PackageTraveler;

public interface PackageTravelerRepository extends JpaRepository<PackageTraveler, Long> {

}
