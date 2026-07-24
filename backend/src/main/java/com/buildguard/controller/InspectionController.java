package com.buildguard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.buildguard.dto.InspectionResponseDto;
import com.buildguard.service.InspectionService;

@RestController
@RequestMapping("/api/inspections")

public class InspectionController {

    private final InspectionService inspectionService;

    public InspectionController(InspectionService inspectionService) {
        this.inspectionService = inspectionService;
    }

    // Create Inspection
    @PostMapping
    public InspectionResponseDto createInspection(

            @RequestParam String inspectionDate,
            @RequestParam String status,
            @RequestParam String remarks,
            @RequestParam Long inspectorId,
            @RequestParam Long progressLogId) {

        return inspectionService.createInspection(
                inspectionDate,
                status,
                remarks,
                inspectorId,
                progressLogId);
    }

    // Get All Inspections
    @GetMapping
    public List<InspectionResponseDto> getAllInspections() {
        return inspectionService.getAllInspections();
    }

    // Get Inspection By Id
    @GetMapping("/{id}")
    public InspectionResponseDto getInspectionById(
            @PathVariable Long id) {

        return inspectionService.getInspectionById(id);
    }

    // Get Inspections By Progress Log
    @GetMapping("/progress-log/{progressLogId}")
    public List<InspectionResponseDto> getInspectionsByProgressLog(
            @PathVariable Long progressLogId) {

        return inspectionService.getInspectionsByProgressLog(progressLogId);
    }

    // Update Inspection
    @PutMapping("/{id}")
    public InspectionResponseDto updateInspection(

            @PathVariable Long id,
            @RequestParam String inspectionDate,
            @RequestParam String status,
            @RequestParam String remarks) {

        return inspectionService.updateInspection(
                id,
                inspectionDate,
                status,
                remarks);
    }

    // Delete Inspection
    @DeleteMapping("/{id}")
    public String deleteInspection(@PathVariable Long id) {

        inspectionService.deleteInspection(id);

        return "Inspection deleted successfully.";
    }
}