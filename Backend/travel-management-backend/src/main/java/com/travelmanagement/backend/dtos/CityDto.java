package com.travelmanagement.backend.dtos;

import org.springframework.stereotype.Service;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CityDto {
	private String cityName;
	private String stateName;
}
