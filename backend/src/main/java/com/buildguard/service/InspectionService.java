package com.buildguard.service;

import java.util.List;

import com.buildguard.dto.InspectionResponseDto;

public interface InspectionService {

    InspectionResponseDto createInspection(
            String inspectionDate,
            String status,
            String remarks,
            Long inspectorId,
            Long progressLogId);

    List<InspectionResponseDto> getAllInspections();

    InspectionResponseDto getInspectionById(Long id);

    List<InspectionResponseDto> getInspectionsByProgressLog(Long progressLogId);

    InspectionResponseDto updateInspection(
            Long id,
            String inspectionDate,
            String status,
            String remarks);

    void deleteInspection(Long id);
}