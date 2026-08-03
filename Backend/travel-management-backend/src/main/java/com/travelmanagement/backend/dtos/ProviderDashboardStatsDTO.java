package com.travelmanagement.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDashboardStatsDTO {
    private long totalBuses;
    private long activeBuses;
    private long todaysTrips;
    private long seatsBookedToday;
}