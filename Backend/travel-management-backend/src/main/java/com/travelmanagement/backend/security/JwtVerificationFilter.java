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
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Extract Authorization header from the incoming HTTP request
        String authHeader = request.getHeader("Authorization");

        /* 
         * [FRIEND'S CODE - COMMENTED OUT] 
         * Friend's early-exit approach if header is missing or invalid. 
         * Kept your null-safe `if` block below instead to allow cleaner fallback execution.
         */
        // if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        //     filterChain.doFilter(request, response);
        //     return;
        // }

        // [YOUR CODE - ACTIVE] Validates header existence and token format safely
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            // Added friend's useful log statement for debugging incoming tokens
            log.info("JWT Token Received : {}", jwt);

            try {
                Claims claims = jwtUtils.verifyJwtAndExtractClaims(jwt);

                // [YOUR CODE - ACTIVE] Safely extract userId supporting Long, Integer, or String types from claims
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

                // [YOUR CODE - ACTIVE] Safely extract role with fallbacks and ROLE_ prefix handling
                String role = claims.get("user_role", String.class);
                if (role == null) {
                    role = claims.get("role", String.class);
                }
                if (role == null) {
                    role = "USER"; // Default fallback role
                }

                String formattedRole = !role.startsWith("ROLE_") ? "ROLE_" + role : role;

                // Added friend's useful log statements for tracking parsed values
                log.info("User Id : {}", userId);
                log.info("Role : {}", formattedRole);

                // Create Authentication token with fallback user ID support
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId != null ? userId : 1L,
                                null,
                                List.of(new SimpleGrantedAuthority(formattedRole)));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                /* 
                 * [FRIEND'S CODE - COMMENTED OUT] 
                 * Friend's direct filter chain execution and basic exception block. 
                 * Replaced with your advanced structured JSON error catch block below.
                 */
                // filterChain.doFilter(request, response);
                // } catch (Exception ex) {
                // log.error("JWT Validation Failed", ex);
                // ex.printStackTrace();
                // SecurityContextHolder.clearContext();
                // response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                // response.getWriter().write(ex.getMessage());

            } catch (Exception ex) {
                // [YOUR CODE - ACTIVE] Comprehensive error logging with URI path and JSON response body
                log.error("JWT Verification failed for path [{}]: {}", request.getRequestURI(), ex.getMessage());
                SecurityContextHolder.clearContext();
                
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid or expired JWT: " + ex.getMessage() + "\"}");
                return;
            }
        }

        // Proceed with the standard filter chain pipeline
        filterChain.doFilter(request, response);
    }
}