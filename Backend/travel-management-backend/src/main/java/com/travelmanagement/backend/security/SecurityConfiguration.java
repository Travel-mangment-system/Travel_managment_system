package com.travelmanagement.backend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtVerificationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

            // CORS
            .cors(cors -> cors.configurationSource(request -> {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                        List.of("http://localhost:5173"));

                configuration.setAllowedMethods(
                        List.of(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"));

                configuration.setAllowedHeaders(
                        List.of("*"));

                configuration.setAllowCredentials(true);

                return configuration;
            }))

            // Disable CSRF (REST API)
            .csrf(csrf -> csrf.disable())

            // Stateless Session
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization
            .authorizeHttpRequests(auth -> auth

                    // Swagger
                    .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html")
                    .permitAll()

                    // Authentication APIs
                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/v1/users/signup",
                            "/api/v1/users/signin")
                    .permitAll()

                    // Any other public APIs
                    .requestMatchers("/auth/**")
                    .permitAll()

                    // Everything else requires JWT
                    .anyRequest()
                    .authenticated()

            )

            // JWT Filter
            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();

    }

}



//package com.travelmanagement.backend.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import lombok.RequiredArgsConstructor;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class SecurityConfiguration {
//
//	private final JwtVerificationFilter jwtFilter;
//
////	@Bean
////	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////		http.csrf(csrf -> csrf.disable())
////			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
////			.authorizeHttpRequests(request -> request
////				// Open up endpoints for Swagger docs, registration, and signin
////					.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/api/v1/users/signin", "/api/v1/users/signup", "/auth/**","/api/v1/*").permitAll()
////				// Restrict bus route management endpoints to system Admins only
//////				.requestMatchers(HttpMethod.POST, "/api/v1/routes/**").hasRole("ADMIN")
//////					.requestMatchers(HttpMethod.POST, "/api/v1/routes/**").hasAuthority("ROLE_ADMIN")
////					.requestMatchers("/**").permitAll()
////				.anyRequest().authenticated())
////			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
////			
////		return http.build();
////	}
//
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
//
//	@Bean
//	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//		return config.getAuthenticationManager();
//	}
//	@Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//	    http
//	        .cors(cors -> cors.configurationSource(request -> {
//	            var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
//	            corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
//	            corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//	            corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
//	            corsConfiguration.setAllowCredentials(true);
//	            return corsConfiguration;
//	        }))
//	        .csrf(csrf -> csrf.disable()) // Only for development
//	        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
//	    
//	    return http.build();
//	}
//}