package com.buildguard.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.buildguard.dto.UserRequest;
import com.buildguard.dto.UserResponse;
import com.buildguard.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {

        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {

        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User Deleted Successfully";
    }
}