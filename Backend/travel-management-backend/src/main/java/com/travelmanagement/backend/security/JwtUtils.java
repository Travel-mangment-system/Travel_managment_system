package com.travelmanagement.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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

        log.info("Generating JWT Secret Key...");

        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

    }

    public String generateJWT(CustomUserDetailsImp userDetails) {

        Date now = new Date();

        Date expDate = new Date(now.getTime() + expTime);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(expDate)
                .claim("user_id", userDetails.getUserId())
                .claim("user_role", userDetails.getRole().name())
                .signWith(key)
                .compact();

    }

    public Claims verifyJwtAndExtractClaims(String jwt) {

        log.info("Incoming JWT : {}", jwt);

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();

        log.info("JWT Validated Successfully");

        return claims;

    }

}