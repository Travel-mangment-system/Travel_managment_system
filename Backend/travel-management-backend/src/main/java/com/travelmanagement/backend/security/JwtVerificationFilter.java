//package com.travelmanagement.backend.security;
//
//import java.io.IOException;
//import java.util.List;
//
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import io.jsonwebtoken.Claims;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class JwtVerificationFilter extends OncePerRequestFilter {
//
//	private final JwtUtils jwtUtils;
//
//	@Override
//	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//			throws ServletException, IOException {
//		try {
//			String authHeader = request.getHeader("Authorization");
////			if (authHeader != null && authHeader.startsWith("Bearer ")) {
//			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//				String jwt = authHeader.substring(7);
//				log.info("*********** Extracted Incoming JWT Target Header: {}", jwt);
//				Claims payload = jwtUtils.verifyJwtAndExtractClaims(jwt);
//				
//				Long userId = payload.get("user_id", Long.class);
//				String roleName = payload.get("user_role", String.class);
//				
//				UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
//						userId, null, List.of(new SimpleGrantedAuthority(roleName)));
//				
//				SecurityContextHolder.getContext().setAuthentication(token);
//			}
//			filterChain.doFilter(request, response);
//		} catch (Exception e) {
//			SecurityContextHolder.clearContext();
//			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//			response.getWriter().print("Invalid JWT - Auth Failed !!!!!!");
//			return;
//		}
//	}
//}


package com.travelmanagement.backend.security;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtVerificationFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		// DEVELOPMENT MODE: Token validations completely removed.
		// Forwarding every incoming request straight down the security filter chain.
		filterChain.doFilter(request, response);
	}
}