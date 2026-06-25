package com.travelmanagement.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmanagement.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
