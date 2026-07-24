package com.buildguard.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InspectionRequestDto {

    private LocalDate inspectionDate;
    private String status;
    private String remarks;
    private Long inspectorId;
    private Long progressLogId;
}