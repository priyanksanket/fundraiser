package com.fundraiser.service;

import com.fundraiser.dao.UserDAO;
import com.fundraiser.model.User;
import com.fundraiser.util.PasswordUtil;

import java.util.Optional;

public class UserService {

    private UserDAO userDAO;

    public UserService() {
        this.userDAO = new UserDAO();
    }

    // Method to register a new user
    public boolean registerUser(User user) {
        if (userDAO.getUserByEmail(user.getEmail()).isPresent()) {
            // User with this email already exists
            return false;
        }
        return userDAO.saveUser(user);
    }

    // Method to validate user login
    public boolean validateLogin(String email, String password) {
        Optional<User> userOpt = userDAO.getUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return PasswordUtil.checkPassword(password, user.getPassword()); // Check if the password matches
        }
        return false;
    }

    // Method to get user details by email
    public Optional<User> getUserByEmail(String email) {
        return userDAO.getUserByEmail(email);
    }

    // Method to update user information
    public boolean updateUser(User user) {
        return userDAO.updateUser(user);
    }

    // Method to delete a user account
    public boolean deleteUser(String email) {
        return userDAO.deleteUser(email);
    }
}
