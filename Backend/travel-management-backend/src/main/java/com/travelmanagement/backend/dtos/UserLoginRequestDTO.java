package com.travelmanagement.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequestDTO {
	private String email;
	private  String passwordHash;
	
}
