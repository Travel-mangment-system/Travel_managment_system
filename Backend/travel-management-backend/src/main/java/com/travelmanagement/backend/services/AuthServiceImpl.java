
package com.travelmanagement.backend.services;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.travelmanagement.backend.dtos.RegisterRequestDTO;
import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.entities.UserStatus;
import com.travelmanagement.backend.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	@Transactional
	@Override
	public String registerUser(RegisterRequestDTO registerDTO) {
		User user=modelMapper.map(registerDTO,User.class);
		user.setStatus(UserStatus.ACTIVE);
		userRepository.save(user);
		return "Register Succesfully !";
	}
}
