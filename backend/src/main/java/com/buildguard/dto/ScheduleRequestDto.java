package com.buildguard.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequestDto {

    private String taskName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long projectId;
}