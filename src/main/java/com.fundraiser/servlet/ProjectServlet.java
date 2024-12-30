package com.fundraiser.servlet;

import com.fundraiser.model.Project;
import com.fundraiser.service.ProjectService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/projects")
public class ProjectServlet extends HttpServlet {

    private ProjectService projectService;

    // Initialize the ProjectService
    @Override
    public void init() {
        projectService = new ProjectService();
    }

    // Display all projects (GET request)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("view".equals(action)) {
            // View the details of a specific project
            int projectId = Integer.parseInt(request.getParameter("id"));
            Project project = projectService.getProjectById(projectId);
            if (project != null) {
                request.setAttribute("project", project);
                request.getRequestDispatcher("/WEB-INF/views/projectDetails.jsp").forward(request, response);
            } else {
                request.setAttribute("errorMessage", "Project not found.");
                request.getRequestDispatcher("/WEB-INF/views/projectList.jsp").forward(request, response);
            }
        } else {
            // Default action: display all projects
            List<Project> projects = projectService.getAllProjects();
            request.setAttribute("projects", projects);
            request.getRequestDispatcher("/WEB-INF/views/projectList.jsp").forward(request, response);
        }
    }

    // Create a new project (POST request)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String description = request.getParameter("description");
        double goalAmount = Double.parseDouble(request.getParameter("goalAmount"));
        String ownerEmail = request.getParameter("ownerEmail");

        // Create a new Project object
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setGoalAmount(goalAmount);
        project.setOwnerEmail(ownerEmail);

        // Save the project using ProjectService
        boolean isProjectCreated = projectService.createProject(project);

        if (isProjectCreated) {
            response.sendRedirect("projects"); // Redirect to the list of projects
        } else {
            request.setAttribute("errorMessage", "Failed to create the project. Try again.");
            request.getRequestDispatcher("/WEB-INF/views/createProject.jsp").forward(request, response);
        }
    }

    // Edit an existing project (PUT or POST request for editing)
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int projectId = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");
        String description = request.getParameter("description");
        double goalAmount = Double.parseDouble(request.getParameter("goalAmount"));

        Project project = projectService.getProjectById(projectId);
        if (project != null) {
            project.setName(name);
            project.setDescription(description);
            project.setGoalAmount(goalAmount);
            projectService.updateProject(project);
            response.sendRedirect("projects?action=view&id=" + projectId); // Redirect to the project details page
        } else {
            request.setAttribute("errorMessage", "Project not found.");
            request.getRequestDispatcher("/WEB-INF/views/projectList.jsp").forward(request, response);
        }
    }

    // Delete a project (DELETE request)
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int projectId = Integer.parseInt(request.getParameter("id"));

        boolean isDeleted = projectService.deleteProject(projectId);
        if (isDeleted) {
            response.sendRedirect("projects"); // Redirect to the list of projects
        } else {
            request.setAttribute("errorMessage", "Failed to delete the project.");
            request.getRequestDispatcher("/WEB-INF/views/projectList.jsp").forward(request, response);
        }
    }
}
