package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.BusStatus;
import lombok.Data;

@Data
public class BusStatusRequestDTO {
    private BusStatus status;
}