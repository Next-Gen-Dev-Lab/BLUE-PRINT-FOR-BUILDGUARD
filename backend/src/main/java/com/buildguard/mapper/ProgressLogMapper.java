package com.buildguard.mapper;

import org.springframework.stereotype.Component;

import com.buildguard.dto.ProgressLogResponseDto;
import com.buildguard.entity.ProgressLog;

@Component
public class ProgressLogMapper {

    public ProgressLogResponseDto toDto(ProgressLog progressLog) {

        if (progressLog == null) {
            return null;
        }

        ProgressLogResponseDto dto = new ProgressLogResponseDto();

        dto.setId(progressLog.getId());
        dto.setDescription(progressLog.getDescription());

        dto.setImageName(progressLog.getImageName());
        dto.setImageSize(progressLog.getImageSize());
        dto.setImageType(progressLog.getImageType());
        dto.setImageUrl(progressLog.getImageUrl());

        dto.setUploadedAt(progressLog.getUploadedAt());
        dto.setCreatedAt(progressLog.getCreatedAt());

        dto.setWorkDate(progressLog.getWorkDate());
        dto.setWorkStatus(progressLog.getWorkStatus());

        if (progressLog.getProject() != null) {
            dto.setProjectId(progressLog.getProject().getId());
        }

        if (progressLog.getUser() != null) {
            dto.setUserId(progressLog.getUser().getId());
        }

        if (progressLog.getUploadedBy() != null) {
            dto.setUploadedBy(progressLog.getUploadedBy().getId());
        }

        return dto;
    }

    public ProgressLog toEntity(ProgressLogResponseDto dto) {

        if (dto == null) {
            return null;
        }

        ProgressLog progressLog = new ProgressLog();

        progressLog.setId(dto.getId());
        progressLog.setDescription(dto.getDescription());

        progressLog.setImageName(dto.getImageName());
        progressLog.setImageSize(dto.getImageSize());
        progressLog.setImageType(dto.getImageType());
        progressLog.setImageUrl(dto.getImageUrl());

        progressLog.setUploadedAt(dto.getUploadedAt());
        progressLog.setCreatedAt(dto.getCreatedAt());

        progressLog.setWorkDate(dto.getWorkDate());
        progressLog.setWorkStatus(dto.getWorkStatus());

        return progressLog;
    }
}