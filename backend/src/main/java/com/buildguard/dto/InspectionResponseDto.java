package com.buildguard.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InspectionResponseDto {

    private Long id;
    private LocalDate inspectionDate;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
    private Long inspectorId;
    private Long progressLogId;
}