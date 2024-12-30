package com.fundraiser.dao;

import com.fundraiser.model.Project;
import com.fundraiser.util.DbConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProjectDAO {

    private static final String GET_ALL_PROJECTS_QUERY = "name";
    private Connection connection;

    // Constructor that initializes the connection
    public ProjectDAO() throws SQLException {
        this.connection = DbConnection.getConnection();
    }

    // Method to save a project into the database
    public boolean saveProject(Project project) {
        String query = "INSERT INTO projects (title, description, goal_amount, current_amount, status, user_id) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setString(1, project.getTitle());
            stmt.setString(2, project.getDescription());
            stmt.setDouble(3, project.getGoalAmount());
            stmt.setDouble(4, project.getCurrentAmount());
            stmt.setString(5, project.getStatus());
            stmt.setInt(6, project.getUserId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Method to get a project by its ID
    public Project getProjectById(int projectId) {
        String query = "SELECT * FROM projects WHERE project_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, projectId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Project(
                        rs.getInt("project_id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getDouble("goal_amount"),
                        rs.getDouble("current_amount"),
                        rs.getString("status"),
                        rs.getInt("user_id")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Method to get all projects for a specific user
    public List<Project> getProjectsByUserId(int userId) {
        List<Project> projects = new ArrayList<>();
        String query = "SELECT * FROM projects WHERE user_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                projects.add(new Project(
                        rs.getInt("project_id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getDouble("goal_amount"),
                        rs.getDouble("current_amount"),
                        rs.getString("status"),
                        rs.getInt("user_id")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return projects;
    }

    // Method to update project details
    public boolean updateProject(Project project) {
        String query = "UPDATE projects SET title = ?, description = ?, goal_amount = ?, current_amount = ?, status = ? WHERE project_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setString(1, project.getTitle());
            stmt.setString(2, project.getDescription());
            stmt.setDouble(3, project.getGoalAmount());
            stmt.setDouble(4, project.getCurrentAmount());
            stmt.setString(5, project.getStatus());
            stmt.setInt(6, project.getProjectId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Method to delete a project by projectId
    public boolean deleteProject(int projectId) {
        String query = "DELETE FROM projects WHERE project_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, projectId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }


    public List<Project> getAllProjects() throws SQLException {
        List<Project> projects = new ArrayList<>();

        try (Connection connection = DbConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(GET_ALL_PROJECTS_QUERY);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            while (resultSet.next()) {
                Project project = new Project();


                project.setDescription(resultSet.getString("description"));
                project.setGoalAmount(resultSet.getDouble("goal_amount"));


                project.setStatus(resultSet.getString("status"));

                projects.add(project);
            }
        }

        return projects;
    }
}
