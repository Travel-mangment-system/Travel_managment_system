package com.travelmanagement.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelmanagement.backend.dtos.RegisterRequestDTO;
import com.travelmanagement.backend.dtos.UserLoginRequestDTO;
import com.travelmanagement.backend.dtos.UserLoginResponseDTO;
import com.travelmanagement.backend.dtos.UserProfileResponseDTO;
import com.travelmanagement.backend.sevices.UserService;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@Getter
@Setter
@RestController
public class UserController {
	private final UserService userService;
	
	@PostMapping("/signup")
	public ResponseEntity<UserProfileResponseDTO> registerUser(@RequestBody RegisterRequestDTO requestDTO) {
		UserProfileResponseDTO response = userService.registerUser(requestDTO);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	// 2. ENDPOINT FOR USER LOGIN (Sign In - Generates Token)
	@PostMapping("/signin")
	public ResponseEntity<UserLoginResponseDTO> loginUser(@RequestBody UserLoginRequestDTO loginDTO) {
		UserLoginResponseDTO response = userService.loginUser(loginDTO);
		return ResponseEntity.ok(response);
	}
	
}
