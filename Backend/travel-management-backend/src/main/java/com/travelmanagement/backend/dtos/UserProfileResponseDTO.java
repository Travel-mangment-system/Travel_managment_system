package com.travelmanagement.backend.dtos;

import com.travelmanagement.backend.entities.UserRole;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UserProfileResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
}