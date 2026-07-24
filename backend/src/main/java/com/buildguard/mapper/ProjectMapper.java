package com.buildguard.mapper;

import com.buildguard.dto.ProjectRequest;
import com.buildguard.dto.ProjectResponse;
import com.buildguard.entity.Project;

public class ProjectMapper {

    private ProjectMapper() {
    }

    public static Project toEntity(ProjectRequest request) {

        Project project = new Project();

        project.setProjectName(request.getProjectName());
        project.setLocation(request.getLocation());
        project.setClientName(request.getClientName());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());

        return project;
    }

    public static ProjectResponse toResponse(Project project) {

        ProjectResponse response = new ProjectResponse();

        response.setId(project.getId());
        response.setProjectName(project.getProjectName());
        response.setLocation(project.getLocation());
        response.setClientName(project.getClientName());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());
        response.setStatus(project.getStatus());

        return response;
    }

}