package com.buildguard.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    private String projectName;
    private String location;
    private String clientName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}