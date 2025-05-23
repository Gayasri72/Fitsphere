package com.fitsphere.service;

import com.fitsphere.dto.AuthenticationRequest;
import com.fitsphere.dto.AuthenticationResponse;
import com.fitsphere.dto.RegisterRequest;
import com.fitsphere.model.User;
import com.fitsphere.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        
        // Include user ID in the token payload with explicit casting
        var extraClaims = Map.of("id", (Object) user.getId());
        var token = jwtService.generateToken(extraClaims, user);
        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        var user = userRepository.findByEmail(request.email())
                .orElseThrow();
        
        // Include user ID in the token payload with explicit casting
        var extraClaims = Map.of("id", (Object) user.getId());
        var token = jwtService.generateToken(extraClaims, user);
        return new AuthenticationResponse(token);
    }
}
