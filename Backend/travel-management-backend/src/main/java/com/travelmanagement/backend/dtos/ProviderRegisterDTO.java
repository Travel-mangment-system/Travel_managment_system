package com.travelmanagement.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProviderRegisterDTO {
	private String companyName;
	private String gstNumber;
	private String address;
	private Long userId;
}
