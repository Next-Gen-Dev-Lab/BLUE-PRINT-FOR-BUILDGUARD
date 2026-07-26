package com.buildguard.controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.buildguard.dto.LoginRequest;
import com.buildguard.dto.LoginResponse;
import com.buildguard.entity.User;
import com.buildguard.repository.UserRepository;
import com.buildguard.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("User Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(user);
    }

}