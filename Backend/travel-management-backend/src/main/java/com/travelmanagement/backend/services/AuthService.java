package com.travelmanagement.backend.services;

import com.travelmanagement.backend.dtos.RegisterRequestDTO;

public interface AuthService {

	String registerUser(RegisterRequestDTO registerDTO);

}
