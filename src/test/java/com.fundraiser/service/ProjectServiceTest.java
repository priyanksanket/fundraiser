package com.fundraiser.service;

import com.fundraiser.dao.ProjectDAO;
import com.fundraiser.model.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class ProjectServiceTest {

    private ProjectService projectService;
    private ProjectDAO projectDAO;

    @BeforeEach
    public void setUp() {
        // Mock the ProjectDAO dependency
        projectDAO = mock(ProjectDAO.class);
        projectService = new ProjectService(projectDAO);
    }

    @Test
    public void testCreateProject() {
        Project project = new Project();
        project.setTitle("New Project");
        project.setDescription("This is a new test project.");

        when(projectDAO.saveProject(project)).thenReturn(true);

        boolean isCreated = projectService.createProject(project);
        assertTrue(isCreated, "Project should be created successfully");
        verify(projectDAO, times(1)).saveProject(project);
    }

    @Test
    public void testGetProjectById() {
        Project project = new Project();
        project.setId(1);
        project.setTitle("Test Project");
        project.setDescription("This is a test project.");

        when(projectDAO.getProjectById(1)).thenReturn(project);

        Project retrievedProject = projectService.getProjectById(1);
        assertNotNull(retrievedProject, "Project should be retrieved successfully");
        assertEquals("Test Project", retrievedProject.getTitle(), "Project title should match");
    }

    @Test
    public void testUpdateProject() {
        Project project = new Project();
        project.setId(1);
        project.setTitle("Old Title");
        project.setDescription("Old description.");

        when(projectDAO.updateProject(project)).thenReturn(true);

        boolean isUpdated = projectService.updateProject(project);
        assertTrue(isUpdated, "Project should be updated successfully");
        verify(projectDAO, times(1)).updateProject(project);
    }

    @Test
    public void testDeleteProject() {
        Project project = new Project();
        project.setId(1);
        project.setTitle("Delete Me");
        project.setDescription("This project will be deleted.");

        when(projectDAO.deleteProject(1)).thenReturn(true);

        boolean isDeleted = projectService.deleteProject(1);
        assertTrue(isDeleted, "Project should be deleted successfully");
        verify(projectDAO, times(1)).deleteProject(1);
    }
}
