package com.travelmanagement.backend.dtos;


import com.travelmanagement.backend.entities.PackageStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePackageStatusRequest {

	@NotNull
	private PackageStatus status;
}