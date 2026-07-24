package com.buildguard.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.buildguard.dto.ProgressLogResponseDto;
import com.buildguard.service.ProgressLogService;

@RestController
@RequestMapping("/api/progress-logs")

public class ProgressLogController {

    private final ProgressLogService progressLogService;

    public ProgressLogController(ProgressLogService progressLogService) {
        this.progressLogService = progressLogService;
    }

    // Upload Progress Log
    @PreAuthorize("hasAnyRole('PROJECT_ENGINEER','FOREMAN')")
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProgressLogResponseDto uploadProgressLog(

            @RequestParam String description,
            @RequestParam String workDate,
            @RequestParam String workStatus,
            @RequestParam Long projectId,
            @RequestParam Long userId,
            @RequestParam Long uploadedBy,
            @RequestParam MultipartFile image) {

        return progressLogService.uploadProgressLog(
                description,
                workDate,
                workStatus,
                projectId,
                userId,
                uploadedBy,
                image);
    }

    
    // Get All Progress Logs
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_ENGINEER','FOREMAN')")
    @GetMapping
    public List<ProgressLogResponseDto> getAllProgressLogs() {
        return progressLogService.getAllProgressLogs();
    }

    // Get Progress Log By Id
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_ENGINEER','FOREMAN')")
    
    @GetMapping("/{id}")
    public ProgressLogResponseDto getProgressLogById(@PathVariable Long id) {
        return progressLogService.getProgressLogById(id);
    }

    // Get Progress Logs By Project
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_ENGINEER','FOREMAN')")
    
    @GetMapping("/project/{projectId}")
    
    public List<ProgressLogResponseDto> getProgressLogsByProject(
            @PathVariable Long projectId) {

        return progressLogService.getProgressLogsByProject(projectId);
    }

    // Update Progress Log
    @PreAuthorize("hasAnyRole('PROJECT_ENGINEER','FOREMAN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProgressLogResponseDto updateProgressLog(

            @PathVariable Long id,
            @RequestParam String description,
            @RequestParam String workDate,
            @RequestParam String workStatus,
            @RequestParam(required = false) MultipartFile image) {

        return progressLogService.updateProgressLog(
                id,
                description,
                workDate,
                workStatus,
                image);
    }

    // Delete Progress Log
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteProgressLog(@PathVariable Long id) {

        progressLogService.deleteProgressLog(id);

        return "Progress Log deleted successfully.";
    }
} 