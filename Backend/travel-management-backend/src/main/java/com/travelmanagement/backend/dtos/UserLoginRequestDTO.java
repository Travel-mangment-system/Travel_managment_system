package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequestDTO {
	private String email;
	private  String passwordHash;
	  // Selected role from login page
    private UserRole role;
}
