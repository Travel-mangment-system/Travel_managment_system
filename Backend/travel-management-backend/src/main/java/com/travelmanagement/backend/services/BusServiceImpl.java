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
        BusProvider provider = providerRepository.findById(request.getProviderId()).orElseThrow();
        Route route = routeRepository.findById(request.getRouteId()).orElseThrow();

        Bus bus = modelMapper.map(request, Bus.class);
        bus.setBusProvider(provider);
        bus.setRoute(route);
        bus.setStatus(BusStatus.ACTIVE);

        return modelMapper.map(busRepository.save(bus), BusResponseDTO.class);
    }

    @Override
    public BusResponseDTO getBusById(Long id) {
        Bus bus = busRepository.findById(id).orElseThrow();
        return modelMapper.map(bus, BusResponseDTO.class);
    }

    @Override
    public BusResponseDTO updateStatus(Long id, BusStatusRequestDTO request) {
        Bus bus = busRepository.findById(id).orElseThrow();
        bus.setStatus(request.getStatus());
        return modelMapper.map(busRepository.save(bus), BusResponseDTO.class);
    }
}