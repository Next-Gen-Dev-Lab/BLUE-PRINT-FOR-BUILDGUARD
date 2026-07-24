package com.buildguard.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.buildguard.dto.ProgressLogResponseDto;

public interface ProgressLogService {

    ProgressLogResponseDto uploadProgressLog(
            String description,
            String workDate,
            String workStatus,
            Long projectId,
            Long userId,
            Long uploadedBy,
            MultipartFile image);

    List<ProgressLogResponseDto> getAllProgressLogs();

    ProgressLogResponseDto getProgressLogById(Long id);

    List<ProgressLogResponseDto> getProgressLogsByProject(Long projectId);

    ProgressLogResponseDto updateProgressLog(
            Long id,
            String description,
            String workDate,
            String workStatus,
            MultipartFile image);

    void deleteProgressLog(Long id);
}