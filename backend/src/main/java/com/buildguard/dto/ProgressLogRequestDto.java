package com.buildguard.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressLogRequestDto {

    private String description;
    private LocalDate workDate;
    private String workStatus;
    private Long projectId;
    private Long userId;
    private Long uploadedBy;

}