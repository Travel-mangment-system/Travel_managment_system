package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.Gender;
import com.travelmanagement.backend.entities.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {
	private String fullName;
	private String email;
	private String passwordHash;
	private String phone;
	private Gender gender;
	private UserRole role;
}
