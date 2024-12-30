package com.fundraiser.model;

public class User {
    private int userId;
    private String fullName;
    private String email;
    private String password;
    private String role;

    // Default constructor
    public User() {}

    // Constructor with parameters
    public User(int userId, String fullName, String email, String password, String role) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getter and Setter methods
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // Override toString() for debugging purposes (optional)
    @Override
    public String toString() {
        return "User{id=" + userId + ", name='" + fullName + "', email='" + email + "', role='" + role + "'}";
    }
}
