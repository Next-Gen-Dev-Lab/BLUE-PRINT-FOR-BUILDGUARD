package com.buildguard.service;

import java.util.List;

import com.buildguard.dto.SafetyViolationResponseDto;

public interface SafetyViolationService {

    SafetyViolationResponseDto createViolation(
            String violationType,
            String description,
            String severity,
            String status,
            Long inspectionId);

    List<SafetyViolationResponseDto> getAllViolations();

    SafetyViolationResponseDto getViolationById(Long id);

    List<SafetyViolationResponseDto> getViolationsByInspection(Long inspectionId);

    SafetyViolationResponseDto updateViolation(
            Long id,
            String violationType,
            String description,
            String severity,
            String status);

    void deleteViolation(Long id);
}