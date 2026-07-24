package com.buildguard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlueprintRequestDto {

    private String blueprintName;
    private String description;
    private Long projectId;
}