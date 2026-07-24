package com.buildguard.service;

import java.util.List;

import com.buildguard.dto.UserRequest;
import com.buildguard.dto.UserResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    void deleteUser(Long id);
}