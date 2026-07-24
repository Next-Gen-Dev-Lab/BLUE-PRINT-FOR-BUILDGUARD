package com.buildguard.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressLogResponseDto {

    private Long id;
    private String description;

    private String imageName;
    private Long imageSize;
    private String imageType;
    private String imageUrl;

    private LocalDateTime uploadedAt;
    private LocalDateTime createdAt;

    private LocalDate workDate;
    private String workStatus;

    private Long projectId;
    private Long userId;
    private Long uploadedBy;
}