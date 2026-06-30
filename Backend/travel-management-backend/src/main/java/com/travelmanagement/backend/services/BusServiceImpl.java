package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.*;
import com.travelmanagement.backend.entities.*;
import com.travelmanagement.backend.entities.bus.*;
import com.travelmanagement.backend.repositories.BusProviderRepository;
import com.travelmanagement.backend.repositories.BusRepository;
import com.travelmanagement.backend.repositories.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final BusProviderRepository providerRepository;
    private final RouteRepository routeRepository;
    private final ModelMapper modelMapper;

    @Override
    public BusResponseDTO addBus(BusRequestDTO request) {
        // Added clear exception messages to prevent generic NoSuchElementException
        BusProvider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Bus Provider not found with ID: " + request.getProviderId()));
        
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found with ID: " + request.getRouteId()));

        Bus bus = new Bus();
        bus.setBusNumber(request.getBusNumber());
        bus.setBusName(request.getBusName());
        bus.setBusType(request.getBusType());
        bus.setTotalSeats(request.getTotalSeats());
        bus.setBusProvider(provider);
        bus.setRoute(route);
        bus.setStatus(BusStatus.ACTIVE);
        Bus savedBus = busRepository.save(bus);

        return modelMapper.map(savedBus, BusResponseDTO.class);
    }

    @Override
    public BusResponseDTO getBusById(Long id) {
        // Added exception message
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
        
        return modelMapper.map(bus, BusResponseDTO.class);
    }

    @Override
    public BusResponseDTO updateStatus(Long id, BusStatusRequestDTO request) {
        // Added exception message
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
        
        bus.setStatus(request.getStatus());
        return modelMapper.map(busRepository.save(bus), BusResponseDTO.class);
    }
}