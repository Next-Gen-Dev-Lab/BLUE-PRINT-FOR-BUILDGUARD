package com.buildguard.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.buildguard.dto.UserRequest;
import com.buildguard.dto.UserResponse;
import com.buildguard.entity.User;
import com.buildguard.exception.DuplicateResourceException;
import com.buildguard.exception.ResourceNotFoundException;
import com.buildguard.mapper.UserMapper;
import com.buildguard.repository.UserRepository;
import com.buildguard.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private static final String USER_NOT_FOUND = "User not found";
    private static final String EMAIL_ALREADY_EXISTS = "Email already exists";

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(EMAIL_ALREADY_EXISTS);
        }

        User user = UserMapper.toEntity(request);
        User savedUser = userRepository.save(user);

        return UserMapper.toResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));

        return UserMapper.toResponse(user);
    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));

        userRepository.delete(user);
    }
}