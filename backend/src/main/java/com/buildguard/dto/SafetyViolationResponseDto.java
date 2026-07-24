package com.buildguard.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafetyViolationResponseDto {

    private Long id;
    private String violationType;
    private String description;
    private String severity;
    private String status;
    private LocalDateTime createdAt;
    private Long inspectionId;
}