package com.buildguard.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.buildguard.dto.BlueprintResponseDto;
import com.buildguard.service.BlueprintService;

@RestController
@RequestMapping("/api/blueprints")
@CrossOrigin(origins = "*")
public class BlueprintController {

    private final BlueprintService blueprintService;

    public BlueprintController(BlueprintService blueprintService) {
        this.blueprintService = blueprintService;
    }

    /**
     * Upload Blueprint
     */
    @PostMapping("/upload")
    public ResponseEntity<BlueprintResponseDto> uploadBlueprint(
            @RequestParam("projectId") Long projectId,
            @RequestParam("blueprintName") String blueprintName,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) {

        BlueprintResponseDto response = blueprintService.uploadBlueprint(
                projectId,
                blueprintName,
                description,
                file
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get All Blueprints
     */
    @GetMapping
    public ResponseEntity<List<BlueprintResponseDto>> getAllBlueprints() {

        return ResponseEntity.ok(
                blueprintService.getAllBlueprints()
        );
    }

    /**
     * Get Blueprint By Id
     */
    @GetMapping("/{id}")
    public ResponseEntity<BlueprintResponseDto> getBlueprintById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                blueprintService.getBlueprintById(id)
        );
    }

    /**
     * Get Blueprint By Project
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<BlueprintResponseDto>> getBlueprintsByProject(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                blueprintService.getBlueprintsByProject(projectId)
        );
    }

    /**
     * Delete Blueprint
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBlueprint(
            @PathVariable Long id) {

        blueprintService.deleteBlueprint(id);

        return ResponseEntity.ok("Blueprint deleted successfully.");
    }

}