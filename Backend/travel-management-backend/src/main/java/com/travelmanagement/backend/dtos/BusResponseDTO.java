package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.BusType;
import lombok.Data;


@Data
public class BusResponseDTO {
    private Long id;
    private String busName;
    private BusType busType;
}
