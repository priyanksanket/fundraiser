package com.fundraiser.model;

public class Project {
    private int projectId;
    private String title;
    private String description;
    private double goalAmount;
    private double currentAmount;
    private String status;
    private int userId;

    // Default constructor
    public Project() {}

    // Constructor with parameters
    public Project(int projectId, String title, String description, double goalAmount,
                   double currentAmount, String status, int userId) {
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.goalAmount = goalAmount;
        this.currentAmount = currentAmount;
        this.status = status;
        this.userId = userId;
    }

    // Getter and Setter methods
    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getGoalAmount() {
        return goalAmount;
    }

    public void setGoalAmount(double goalAmount) {
        this.goalAmount = goalAmount;
    }

    public double getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(double currentAmount) {
        this.currentAmount = currentAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    // Override toString() for debugging purposes (optional)
    @Override
    public String toString() {
        return "Project{id=" + projectId + ", title='" + title + "', description='" + description
                + "', goalAmount=" + goalAmount + ", currentAmount=" + currentAmount + ", status='" + status + "'}";
    }
}
