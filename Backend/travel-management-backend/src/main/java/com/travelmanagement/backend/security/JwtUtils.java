package com.travelmanagement.backend.security;

import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.travelmanagement.backend.security.CustomUserDetailsImp;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
@Component
@Slf4j
public class JwtUtils {

	@Value("${jwt.secret.key}")
	private String secret;
	@Value("${jwt.exp.time}")
	private long expTime; 
	private SecretKey key; 
	
	@PostConstruct
	public void myInit() {
		log.info("******* Generating cryptographic secret key SHA 256 for Travel System");
		key = Keys.hmacShaKeyFor(secret.getBytes());
	}

	public String generateJWT(CustomUserDetailsImp userDetails) {
		Date now = new Date();
		Date expDate = new Date(now.getTime() + expTime); 
		return Jwts.builder() 
				.subject(userDetails.getUsername()) 
				.issuedAt(now) 
				.expiration(expDate) 
				.claims(Map.of("user_id", userDetails.getUserId(), "user_role", userDetails.getRole().name()))
				.signWith(key)
				.compact();
	}

	public Claims verifyJwtAndExtractClaims(String jwt) {
		return Jwts.parser() 
				.verifyWith(key) 
				.build() 
				.parseSignedClaims(jwt) 
				.getPayload();
	}
}