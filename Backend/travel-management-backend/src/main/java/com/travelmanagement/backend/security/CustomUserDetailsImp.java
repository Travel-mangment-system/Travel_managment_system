package com.travelmanagement.backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.travelmanagement.backend.entities.User;
import com.travelmanagement.backend.entities.UserRole;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomUserDetailsImp implements UserDetails {
	
	private static final long serialVersionUID = 1L;
	
	// Industry Standard: Compose the entity rather than duplicating loose data fields
	private final User user;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// Convert the enum role directly from the wrapped domain model object
		return List.of(new SimpleGrantedAuthority(user.getRole().name()));
	}

	@Override
	public String getPassword() {
		return user.getPasswordHash(); // Delegates credential tracking to domain model
	}

	@Override
	public String getUsername() {
		return user.getEmail(); // Uses email cleanly as the security identifier passport
	}

	// Helper getters to allow your JwtUtils engine to fetch custom claims metrics easily
	public Long getUserId() {
		return user.getId();
	}

	public String getUserFullName() {
		return user.getFullName();
	}

	public UserRole getRole() {
		return user.getRole();
	}

	// Enterprise account state handling flags
	@Override
	public boolean isAccountNonExpired() { return true; }
	
	@Override
	public boolean isAccountNonLocked() { return true; }
	
	@Override
	public boolean isCredentialsNonExpired() { return true; }
	
	@Override
	public boolean isEnabled() { return true; }
}