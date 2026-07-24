package com.buildguard.mapper;

import org.springframework.stereotype.Component;

import com.buildguard.dto.InspectionResponseDto;
import com.buildguard.entity.Inspection;

@Component
public class InspectionMapper {

    public InspectionResponseDto toDto(Inspection inspection) {

        if (inspection == null) {
            return null;
        }

        InspectionResponseDto dto = new InspectionResponseDto();

        dto.setId(inspection.getId());
        dto.setInspectionDate(inspection.getInspectionDate());
        dto.setStatus(inspection.getStatus());
        dto.setRemarks(inspection.getRemarks());
        dto.setCreatedAt(inspection.getCreatedAt());

        if (inspection.getInspector() != null) {
            dto.setInspectorId(inspection.getInspector().getId());
        }

        if (inspection.getProgressLog() != null) {
            dto.setProgressLogId(inspection.getProgressLog().getId());
        }

        return dto;
    }

    public Inspection toEntity(InspectionResponseDto dto) {

        if (dto == null) {
            return null;
        }

        Inspection inspection = new Inspection();

        inspection.setId(dto.getId());
        inspection.setInspectionDate(dto.getInspectionDate());
        inspection.setStatus(dto.getStatus());
        inspection.setRemarks(dto.getRemarks());
        inspection.setCreatedAt(dto.getCreatedAt());

        return inspection;
    }
}