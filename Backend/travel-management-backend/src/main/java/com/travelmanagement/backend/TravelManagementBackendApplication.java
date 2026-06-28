package com.travelmanagement.backend;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TravelManagementBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelManagementBackendApplication.class, args);
	}
	
	@Bean
	ModelMapper modelMapper() {
		ModelMapper mapper = new ModelMapper();
		
		// Changed to LOOSE strategy to handle travel DTO transformations without strict mismatches
		mapper.getConfiguration()
			.setMatchingStrategy(MatchingStrategies.LOOSE)
			// Prevents overwriting valid database defaults with null fields during updates
			.setPropertyCondition(Conditions.isNotNull());
			
		return mapper; // Returns the configured instance to the Spring Container
	}
	

}
