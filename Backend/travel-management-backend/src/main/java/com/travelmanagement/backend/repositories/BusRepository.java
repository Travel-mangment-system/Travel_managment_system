package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.Bus;

public interface BusRepository extends JpaRepository<Bus, Long> {

}
