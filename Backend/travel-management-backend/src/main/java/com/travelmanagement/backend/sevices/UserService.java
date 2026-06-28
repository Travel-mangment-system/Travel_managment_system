package com.travelmanagement.backend.sevices;

import com.travelmanagement.backend.dtos.RegisterRequestDTO;
import com.travelmanagement.backend.dtos.UserLoginRequestDTO;
import com.travelmanagement.backend.dtos.UserLoginResponseDTO;
import com.travelmanagement.backend.dtos.UserProfileResponseDTO;

public interface UserService {

	String User_Register(RegisterRequestDTO dTO);

	UserProfileResponseDTO registerUser(RegisterRequestDTO requestDTO);

	UserLoginResponseDTO loginUser(UserLoginRequestDTO loginDTO);



}
