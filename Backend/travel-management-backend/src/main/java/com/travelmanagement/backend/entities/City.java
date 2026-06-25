package com.travelmanagement.backend.entities;
import jakarta.persistence.Column;
/*
 *   class City {
        +Long id
        +String cityName
        +String stateName
    }
*/
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "city")
public class City {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "City_id",nullable = false)
	private Long id;
	
	@Column(name = "city_name")
	private String cityName;
	
	@Column(name = "state_name")
	private String stateName;
}
