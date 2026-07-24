package com.buildguard.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.buildguard.dto.BlueprintResponseDto;

public interface BlueprintService {

    BlueprintResponseDto uploadBlueprint(
            Long projectId,
            String blueprintName,
            String description,
            MultipartFile file);

    List<BlueprintResponseDto> getAllBlueprints();

    BlueprintResponseDto getBlueprintById(Long id);

    List<BlueprintResponseDto> getBlueprintsByProject(Long projectId);

    void deleteBlueprint(Long id);
}