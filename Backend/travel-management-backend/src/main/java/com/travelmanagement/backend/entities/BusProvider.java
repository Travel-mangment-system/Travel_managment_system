package com.travelmanagement.backend.entities;
import java.util.List;

/*
 * class BusProvider {
        +Long id
        +String companyName
        +String gstNumber
        +String address
        +Boolean verified
    }*/
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "bus_provider")
public class BusProvider {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bus_provider_id")
	private Long id;
	
	@Column(name = "company_name")
	private String companyName;
	
	@Column(name = "gst_number")
	private String gstNumber;
	
	@Column(name = "address")
	private String address;
	
	@Column(name = "verification_status")
	private boolean verified;
	
	@ManyToOne(fetch = FetchType.LAZY )
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	
	@OneToMany(mappedBy = "busProvider", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Bus> buses;
}
