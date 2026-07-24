package com.buildguard.mapper;

import org.springframework.stereotype.Component;

import com.buildguard.dto.SafetyViolationResponseDto;
import com.buildguard.entity.SafetyViolation;

@Component
public class SafetyViolationMapper {

    public SafetyViolationResponseDto toDto(SafetyViolation violation) {

        if (violation == null) {
            return null;
        }

        SafetyViolationResponseDto dto = new SafetyViolationResponseDto();

        dto.setId(violation.getId());
        dto.setViolationType(violation.getViolationType());
        dto.setDescription(violation.getDescription());
        dto.setSeverity(violation.getSeverity());
        dto.setStatus(violation.getStatus());
        dto.setCreatedAt(violation.getCreatedAt());

        if (violation.getInspection() != null) {
            dto.setInspectionId(violation.getInspection().getId());
        }

        return dto;
    }

    public SafetyViolation toEntity(SafetyViolationResponseDto dto) {

        if (dto == null) {
            return null;
        }

        SafetyViolation violation = new SafetyViolation();

        violation.setId(dto.getId());
        violation.setViolationType(dto.getViolationType());
        violation.setDescription(dto.getDescription());
        violation.setSeverity(dto.getSeverity());
        violation.setStatus(dto.getStatus());
        violation.setCreatedAt(dto.getCreatedAt());

        return violation;
    }
}