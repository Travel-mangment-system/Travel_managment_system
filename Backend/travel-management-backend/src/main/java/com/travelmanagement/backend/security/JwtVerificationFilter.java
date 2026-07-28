package com.travelmanagement.backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtVerificationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            try {
                Claims claims = jwtUtils.verifyJwtAndExtractClaims(jwt);

                // Safely extract userId supporting Long, Integer, or String types from claims
                Long userId = null;
                Object userIdObj = claims.get("user_id");
                if (userIdObj == null) {
                    userIdObj = claims.get("userId");
                }

                if (userIdObj instanceof Number) {
                    userId = ((Number) userIdObj).longValue();
                } else if (userIdObj instanceof String) {
                    try {
                        userId = Long.parseLong((String) userIdObj);
                    } catch (NumberFormatException ignored) {}
                }

                // Fallback to subject if user ID claim wasn't found directly
                if (userId == null && claims.getSubject() != null) {
                    try {
                        userId = Long.parseLong(claims.getSubject());
                    } catch (NumberFormatException ignored) {}
                }

                // Safely extract role
                String role = claims.get("user_role", String.class);
                if (role == null) {
                    role = claims.get("role", String.class);
                }
                if (role == null) {
                    role = "USER"; // Default fallback role
                }

                String formattedRole = !role.startsWith("ROLE_") ? "ROLE_" + role : role;

                // Create Authentication token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId != null ? userId : 1L,
                                null,
                                List.of(new SimpleGrantedAuthority(formattedRole)));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception ex) {
                log.error("JWT Verification failed for path [{}]: {}", request.getRequestURI(), ex.getMessage());
                SecurityContextHolder.clearContext();
                
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid or expired JWT: " + ex.getMessage() + "\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}