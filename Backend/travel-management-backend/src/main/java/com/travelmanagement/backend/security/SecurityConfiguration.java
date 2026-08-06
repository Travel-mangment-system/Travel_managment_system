package com.travelmanagement.backend.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value; // 👇 ADDED THIS IMPORT
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

    // 👇 ADDED THIS: Injects the frontend URL from environment variables, defaults to localhost
    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration configuration = new CorsConfiguration();

                // 👇 MODIFIED THIS: Added the dynamic frontendUrl to the list of allowed origins
                configuration.setAllowedOrigins(List.of(
                        "http://localhost:5173", 
                        "http://localhost:3000", 
                        frontendUrl
                ));
                
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));

                configuration.setAllowCredentials(true);
                
                return configuration;
            }))

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                  
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                    .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html")
                    .permitAll()

                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/v1/users/signup",
                            "/api/v1/users/signin",
                            "/api/v1/providers")
                    .permitAll()
                    
                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/v1/customer/packages",
                            "/api/v1/customer/packages/**",
                            "/api/v1/buses/search", 
                            "/api/v1/packages/search"
                    )
                    .permitAll()
                    
                    .requestMatchers(
                            "/uploads/**"
                    )
                    .permitAll()

                    // Any other public APIs
                    .requestMatchers("/auth/**").permitAll()
                    
                    // Allow Spring to properly route and display internal server errors
                    .requestMatchers("/error").permitAll() 

                    // Everything else requires JWT
                    .anyRequest().authenticated()
            )

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
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

}