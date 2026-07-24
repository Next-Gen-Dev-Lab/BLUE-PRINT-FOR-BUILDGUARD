package com.buildguard.dto;

import java.time.LocalDateTime;

import com.buildguard.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private Role role;

    private String phone;

    private LocalDateTime createdAt;
}