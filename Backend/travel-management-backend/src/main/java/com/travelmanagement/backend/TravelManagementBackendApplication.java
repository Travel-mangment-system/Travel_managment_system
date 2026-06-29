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
		
		mapper.getConfiguration()
			// 1. Loose matching allows your DTO names to differ slightly from Entity names
			.setMatchingStrategy(MatchingStrategies.LOOSE)
			
			// 2. Prevents null fields from overwriting existing database data during PUT requests
			.setPropertyCondition(Conditions.isNotNull())
			
			// 3. THE GENERIC FIX: Tells ModelMapper to safely ignore multiple matching hierarchies 
			// across ALL controllers and DTOs without crashing the application!
			.setAmbiguityIgnored(true);
			
		return mapper; 
	}
}