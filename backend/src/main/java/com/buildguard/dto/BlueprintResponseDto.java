package com.buildguard.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlueprintResponseDto {

    private Long id;
    private String blueprintName;
    private String description;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String fileUrl;
    private LocalDateTime uploadedAt;
    private Long projectId;
}