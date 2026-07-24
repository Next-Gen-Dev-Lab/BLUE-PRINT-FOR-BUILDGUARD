package com.buildguard.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.buildguard.dto.SafetyViolationResponseDto;
import com.buildguard.entity.Inspection;
import com.buildguard.entity.SafetyViolation;
import com.buildguard.exception.ResourceNotFoundException;
import com.buildguard.mapper.SafetyViolationMapper;
import com.buildguard.repository.InspectionRepository;
import com.buildguard.repository.SafetyViolationRepository;
import com.buildguard.service.SafetyViolationService;

@Service
public class SafetyViolationServiceImpl implements SafetyViolationService {

    private static final String INSPECTION_NOT_FOUND = "Inspection not found";
    private static final String SAFETY_VIOLATION_NOT_FOUND = "Safety Violation not found";

    private final SafetyViolationRepository safetyViolationRepository;
    private final InspectionRepository inspectionRepository;
    private final SafetyViolationMapper safetyViolationMapper;

    public SafetyViolationServiceImpl(
            SafetyViolationRepository safetyViolationRepository,
            InspectionRepository inspectionRepository,
            SafetyViolationMapper safetyViolationMapper) {

        this.safetyViolationRepository = safetyViolationRepository;
        this.inspectionRepository = inspectionRepository;
        this.safetyViolationMapper = safetyViolationMapper;
    }

    @Override
    public SafetyViolationResponseDto createViolation(
            String violationType,
            String description,
            String severity,
            String status,
            Long inspectionId) {

        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new ResourceNotFoundException(INSPECTION_NOT_FOUND));

        SafetyViolation violation = new SafetyViolation();

        violation.setViolationType(violationType);
        violation.setDescription(description);
        violation.setSeverity(severity);
        violation.setStatus(status);
        violation.setCreatedAt(LocalDateTime.now());
        violation.setInspection(inspection);

        SafetyViolation savedViolation = safetyViolationRepository.save(violation);

        return safetyViolationMapper.toDto(savedViolation);
    }

    @Override
    public List<SafetyViolationResponseDto> getAllViolations() {

        return safetyViolationRepository.findAll()
                .stream()
                .map(safetyViolationMapper::toDto)
                .toList();
    }

    @Override
    public SafetyViolationResponseDto getViolationById(Long id) {

        SafetyViolation violation = safetyViolationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(SAFETY_VIOLATION_NOT_FOUND));

        return safetyViolationMapper.toDto(violation);
    }

    @Override
    public List<SafetyViolationResponseDto> getViolationsByInspection(Long inspectionId) {

        return safetyViolationRepository.findByInspectionId(inspectionId)
                .stream()
                .map(safetyViolationMapper::toDto)
                .toList();
    }

    @Override
    public SafetyViolationResponseDto updateViolation(
            Long id,
            String violationType,
            String description,
            String severity,
            String status) {

        SafetyViolation violation = safetyViolationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(SAFETY_VIOLATION_NOT_FOUND));

        violation.setViolationType(violationType);
        violation.setDescription(description);
        violation.setSeverity(severity);
        violation.setStatus(status);

        SafetyViolation updatedViolation = safetyViolationRepository.save(violation);

        return safetyViolationMapper.toDto(updatedViolation);
    }

    @Override
    public void deleteViolation(Long id) {

        SafetyViolation violation = safetyViolationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(SAFETY_VIOLATION_NOT_FOUND));

        safetyViolationRepository.delete(violation);
    }
}