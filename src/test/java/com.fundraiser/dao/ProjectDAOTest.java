package com.fundraiser.dao;

import com.fundraiser.model.Project;
import org.junit.jupiter.api.*;
import java.sql.*;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class ProjectDAOTest {

    private static ProjectDAO projectDAO;
    private static Connection connection;

    @BeforeAll
    public static void setUp() throws SQLException {
        // Set up an in-memory H2 database for testing
        connection = DriverManager.getConnection("jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1", "sa", "");
        connection.createStatement().execute("CREATE TABLE projects (id INT AUTO_INCREMENT, title VARCHAR(255), description TEXT)");

        projectDAO = new ProjectDAO();
    }

    @AfterAll
    public static void tearDown() throws SQLException {
        // Clean up and close the in-memory database
        connection.createStatement().execute("DROP TABLE projects");
        connection.close();
    }

    @Test
    public void testSaveProject() {
        Project project = new Project();
        project.setTitle("New Project");
        project.setDescription("This is a new test project.");

        boolean isSaved = projectDAO.saveProject(project);
        assertTrue(isSaved, "Project should be saved successfully");
    }

    @Test
    public void testGetProjectById() {
        Project project = new Project();
        project.setTitle("Test Project");
        project.setDescription("This project should be retrieved by ID.");
        projectDAO.saveProject(project);

        Project retrievedProject = projectDAO.getProjectById(1);
        assertNotNull(retrievedProject, "Project should be found by ID");
        assertEquals("Test Project", retrievedProject.getTitle(), "Project title should match");
    }

    @Test
    public void testGetAllProjects() {
        Project project1 = new Project();
        project1.setTitle("Project 1");
        project1.setDescription("Description of project 1.");
        projectDAO.saveProject(project1);

        Project project2 = new Project();
        project2.setTitle("Project 2");
        project2.setDescription("Description of project 2.");
        projectDAO.saveProject(project2);

        List<Project> projects = projectDAO.getAllProjects();
        assertEquals(2, projects.size(), "There should be 2 projects in the list");
    }

    @Test
    public void testUpdateProject() {
        Project project = new Project();
        project.setTitle("Old Title");
        project.setDescription("Old description.");
        projectDAO.saveProject(project);

        project.setTitle("Updated Title");
        project.setDescription("Updated description.");
        boolean isUpdated = projectDAO.updateProject(project);

        Project updatedProject = projectDAO.getProjectById(1);
        assertTrue(isUpdated, "Project should be updated successfully");
        assertEquals("Updated Title", updatedProject.getTitle(), "Project title should be updated");
    }

    @Test
    public void testDeleteProject() {
        Project project = new Project();
        project.setTitle("Delete Me");
        project.setDescription("This project will be deleted.");
        projectDAO.saveProject(project);

        boolean isDeleted = projectDAO.deleteProject(1);
        Project deletedProject = projectDAO.getProjectById(1);

        assertTrue(isDeleted, "Project should be deleted successfully");
        assertNull(deletedProject, "Project should not be found after deletion");
    }
}
