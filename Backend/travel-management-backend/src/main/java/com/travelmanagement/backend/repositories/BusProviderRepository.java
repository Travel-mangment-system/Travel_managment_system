
package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelmanagement.backend.entities.BusProvider;

public interface BusProviderRepository extends JpaRepository<BusProvider, Long>{

}
