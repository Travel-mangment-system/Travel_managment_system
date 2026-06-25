package com.travelmanagement.backend.dtos;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppResponseDTO {
    private int statusCode;
    private String message;
    private LocalDateTime timestamp;
}