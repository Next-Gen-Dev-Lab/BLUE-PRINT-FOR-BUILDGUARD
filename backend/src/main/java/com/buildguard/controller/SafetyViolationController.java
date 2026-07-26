package com.buildguard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.buildguard.dto.SafetyViolationResponseDto;
import com.buildguard.service.SafetyViolationService;

@RestController
@RequestMapping("/api/safety-violations")
@CrossOrigin(origins = "*")
public class SafetyViolationController {

    private final SafetyViolationService safetyViolationService;

    public SafetyViolationController(SafetyViolationService safetyViolationService) {
        this.safetyViolationService = safetyViolationService;
    }

    @PostMapping
    public SafetyViolationResponseDto createViolation(

            @RequestParam String violationType,
            @RequestParam String description,
            @RequestParam String severity,
            @RequestParam String status,
            @RequestParam Long inspectionId) {

        return safetyViolationService.createViolation(
                violationType,
                description,
                severity,
                status,
                inspectionId);
    }

    @GetMapping
    public List<SafetyViolationResponseDto> getAllViolations() {
        return safetyViolationService.getAllViolations();
    }

    @GetMapping("/{id}")
    public SafetyViolationResponseDto getViolationById(
            @PathVariable Long id) {

        return safetyViolationService.getViolationById(id);
    }

    @GetMapping("/inspection/{inspectionId}")
    public List<SafetyViolationResponseDto> getViolationsByInspection(
            @PathVariable Long inspectionId) {

        return safetyViolationService.getViolationsByInspection(inspectionId);
    }

    @PutMapping("/{id}")
    public SafetyViolationResponseDto updateViolation(

            @PathVariable Long id,
            @RequestParam String violationType,
            @RequestParam String description,
            @RequestParam String severity,
            @RequestParam String status) {

        return safetyViolationService.updateViolation(
                id,
                violationType,
                description,
                severity,
                status);
    }

    @DeleteMapping("/{id}")
    public String deleteViolation(@PathVariable Long id) {

        safetyViolationService.deleteViolation(id);

        return "Safety Violation deleted successfully.";
    }
}