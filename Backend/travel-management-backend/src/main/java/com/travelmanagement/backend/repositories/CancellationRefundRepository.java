package com.travelmanagement.backend.repositories;

import com.travelmanagement.backend.entities.CancellationRefund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CancellationRefundRepository extends JpaRepository<CancellationRefund, Long> {
    List<CancellationRefund> findByBooking_User_Id(Long userId);
}