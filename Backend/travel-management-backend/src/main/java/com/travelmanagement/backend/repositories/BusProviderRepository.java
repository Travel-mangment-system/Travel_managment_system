package com.travelmanagement.backend.repositories; // Ensure this matches your package structure

import com.travelmanagement.backend.entities.BusProvider; // Adjust if your entity is in a different package
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusProviderRepository extends JpaRepository<BusProvider, Long> {
}