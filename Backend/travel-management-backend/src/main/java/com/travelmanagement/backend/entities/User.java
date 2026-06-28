package com.travelmanagement.backend.entities;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	@Column(name="user_id")
	private Long userId;
	@Column(name="full_name",nullable = false,length = 100)
	private String fullName;
	@Column(name="email",nullable = false,unique = true,length = 100)
	private  String email;
	@Column(name="phone",nullable = false,length = 15)
	private  String phone;
	@Column(name="password",nullable = false)
	private  String passwordHash;
	@Enumerated(EnumType.STRING)
	private Gender gender;
	@Enumerated(EnumType.STRING)
	private UserRole role;
	@Enumerated(EnumType.STRING)
	private UserStatus status;
	@Column(name="created_at",nullable = false,updatable = false)
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	@PrePersist
	protected void onCreate()
	{
		this.createdAt=LocalDateTime.now();
	}

}
