package com.buildguard.mapper;

import org.springframework.stereotype.Component;

import com.buildguard.dto.BlueprintResponseDto;
import com.buildguard.entity.Blueprint;

@Component
public class BlueprintMapper {

    public BlueprintResponseDto toDto(Blueprint blueprint) {

        if (blueprint == null) {
            return null;
        }

        BlueprintResponseDto dto = new BlueprintResponseDto();

        dto.setId(blueprint.getId());
        dto.setBlueprintName(blueprint.getBlueprintName());
        dto.setDescription(blueprint.getDescription());
        dto.setFileName(blueprint.getFileName());
        dto.setFileSize(blueprint.getFileSize());      // NEW
        dto.setFileType(blueprint.getFileType());      // NEW
        dto.setFileUrl(blueprint.getFileUrl());
        dto.setUploadedAt(blueprint.getUploadedAt());

        if (blueprint.getProject() != null) {
            dto.setProjectId(blueprint.getProject().getId());
        }

        return dto;
    }

    public Blueprint toEntity(BlueprintResponseDto dto) {

        if (dto == null) {
            return null;
        }

        Blueprint blueprint = new Blueprint();

        blueprint.setId(dto.getId());
        blueprint.setBlueprintName(dto.getBlueprintName());
        blueprint.setDescription(dto.getDescription());
        blueprint.setFileName(dto.getFileName());
        blueprint.setFileSize(dto.getFileSize());      // NEW
        blueprint.setFileType(dto.getFileType());      // NEW
        blueprint.setFileUrl(dto.getFileUrl());
        blueprint.setUploadedAt(dto.getUploadedAt());

        return blueprint;
    }
}