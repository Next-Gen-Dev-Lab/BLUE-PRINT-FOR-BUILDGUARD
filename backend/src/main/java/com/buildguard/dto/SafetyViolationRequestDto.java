package com.buildguard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafetyViolationRequestDto {

    private String violationType;
    private String description;
    private String severity;
    private String status;
    private Long inspectionId;
}