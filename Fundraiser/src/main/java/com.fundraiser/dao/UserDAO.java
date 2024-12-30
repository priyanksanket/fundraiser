package com.fundraiser.dao;

import com.fundraiser.model.User;
import com.fundraiser.util.PasswordUtil;

import java.sql.*;
import java.util.Optional;

public class UserDAO {

    private Connection connection;

    public UserDAO() {
        try {
            // Initialize the connection to the database
            this.connection = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/fundraiser_db", "root", "password"
            );
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Method to save a new user to the database
    public boolean saveUser(User user) {
        String query = "INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)";

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, user.getEmail());
            statement.setString(2, PasswordUtil.encryptPassword(user.getPassword()));
            statement.setString(3, user.getFullName());

            int rowsAffected = statement.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Method to retrieve a user by email (for login and validation)
    public Optional<User> getUserByEmail(String email) {
        String query = "SELECT * FROM users WHERE email = ?";

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, email);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                User user = new User();
                user.setEmail(resultSet.getString("email"));
                user.setPassword(resultSet.getString("password"));
                user.setFullName(resultSet.getString("full_name"));
                return Optional.of(user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    // Method to update user details (optional, not required for basic registration)
    public boolean updateUser(User user) {
        String query = "UPDATE users SET full_name = ?, password = ? WHERE email = ?";

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, user.getFullName());
            statement.setString(2, PasswordUtil.encryptPassword(user.getPassword()));
            statement.setString(3, user.getEmail());

            int rowsAffected = statement.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Method to delete a user from the database (if needed)
    public boolean deleteUser(String email) {
        String query = "DELETE FROM users WHERE email = ?";

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, email);
            int rowsAffected = statement.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
