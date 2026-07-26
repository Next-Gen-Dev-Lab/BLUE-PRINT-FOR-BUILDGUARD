package com.buildguard.dto;

public class BlueprintRequestDto {

    private String blueprintName;
    private String description;
    private Long projectId;

    public BlueprintRequestDto() {
    }

    public BlueprintRequestDto(String blueprintName, String description, Long projectId) {
        this.blueprintName = blueprintName;
        this.description = description;
        this.projectId = projectId;
    }

    public String getBlueprintName() {
        return blueprintName;
    }

    public void setBlueprintName(String blueprintName) {
        this.blueprintName = blueprintName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}