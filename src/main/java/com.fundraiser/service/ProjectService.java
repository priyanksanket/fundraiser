package com.fundraiser.service;

import com.fundraiser.dao.ProjectDAO;
import com.fundraiser.model.Project;

import java.util.List;

public class ProjectService {
    private ProjectDAO projectDAO;

    public ProjectService() {
        this.projectDAO = new ProjectDAO();
    }

    // Create a new project
    public boolean createProject(Project project) {
        return projectDAO.createProject(project);
    }

    // Get a list of all projects
    public List<Project> getAllProjects() {
        return projectDAO.getAllProjects();
    }

    // Get project details by project ID
    public Project getProjectById(int projectId) {
        return projectDAO.getProjectById(projectId);
    }

    // Update a project
    public boolean updateProject(Project project) {
        return projectDAO.updateProject(project);
    }

    // Delete a project by project ID
    public boolean deleteProject(int projectId) {
        return projectDAO.deleteProject(projectId);
    }

    // Get all projects by user (creator)
    public List<Project> getProjectsByUserId(int userId) {
        return projectDAO.getProjectsByUserId(userId);
    }
}
