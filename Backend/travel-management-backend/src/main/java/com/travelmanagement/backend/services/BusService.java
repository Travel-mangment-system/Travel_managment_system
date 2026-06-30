package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.*;
import java.util.List;

public interface BusService {
    BusResponseDTO addBus(BusRequestDTO request);
    BusResponseDTO getBusById(Long id);
    BusResponseDTO updateStatus(Long id, BusStatusRequestDTO request);
}