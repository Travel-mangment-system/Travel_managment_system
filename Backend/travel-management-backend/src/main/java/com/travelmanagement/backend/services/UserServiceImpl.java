package com.travelmanagement.backend.services;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelmanagement.backend.dtos.RegisterRequestDTO;
import com.travelmanagement.backend.dtos.UserLoginRequestDTO;
import com.travelmanagement.backend.dtos.UserLoginResponseDTO;
import com.travelmanagement.backend.dtos.UserProfileResponseDTO;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.entities.UserStatus;
import com.travelmanagement.backend.repositories.UserRepository;
import com.travelmanagement.backend.security.CustomUserDetailsImp;
import com.travelmanagement.backend.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final ModelMapper mapper;
	private final PasswordEncoder passwordEncoder;     
	private final AuthenticationManager authManager;   
	private final JwtUtils jwtUtils;                    

	@Override
	public UserProfileResponseDTO registerUser(RegisterRequestDTO requestDTO) {
		if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
			throw new RuntimeException("Email identifier already exists!");
		}

		// 1. ModelMapper automatically maps fullName, email, phone, gender, and role directly!
		User user = mapper.map(requestDTO, User.class);
		
		// 2. Encrypt the password and set tracking fields
		user.setPasswordHash(passwordEncoder.encode(requestDTO.getPasswordHash()));
		user.setStatus(UserStatus.ACTIVE);
		user.setCreatedAt(LocalDateTime.now());
		
		User savedUser = userRepository.save(user);
		
		// 3. Return the cleanly assembled Profile DTO
		return mapper.map(savedUser, UserProfileResponseDTO.class);
	}

	@Override
	@Transactional(readOnly = true)
	public UserLoginResponseDTO loginUser(UserLoginRequestDTO loginDTO) {
		UsernamePasswordAuthenticationToken authTicket = 
				new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPasswordHash());
		
		Authentication authenticatedContext = authManager.authenticate(authTicket);
		CustomUserDetailsImp userDetails = (CustomUserDetailsImp) authenticatedContext.getPrincipal();
		String generatedJwt = jwtUtils.generateJWT(userDetails);
		
		UserLoginResponseDTO response = new UserLoginResponseDTO();
		response.setId(userDetails.getUserId());
		response.setFullName(userDetails.getUserFullName());
		response.setEmail(userDetails.getUsername());
		response.setRole(userDetails.getRole());
		response.setToken(generatedJwt); 
		
		return response;
	}

	@Override
	public String User_Register(RegisterRequestDTO DTO) {
		registerUser(DTO);
		return "Register Successfully !";
	}
}