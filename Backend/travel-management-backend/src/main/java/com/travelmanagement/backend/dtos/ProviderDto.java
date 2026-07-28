package com.travelmanagement.backend.dtos;

import java.util.List;

import com.travelmanagement.backend.entities.Bus;

import lombok.Data;

@Data
public class ProviderDto {
	private Long id;
	
	private String companyName;
	
	private String gstNumber;
	
	private String address;
	
	private Long UserId;
	
//	private List<Bus> buses;
}
