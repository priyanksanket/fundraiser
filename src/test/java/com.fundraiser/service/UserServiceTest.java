package com.fundraiser.service;

import com.fundraiser.dao.UserDAO;
import com.fundraiser.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest {

    private UserService userService;
    private UserDAO userDAO;

    @BeforeEach
    public void setUp() {
        // Mock the UserDAO dependency
        userDAO = mock(UserDAO.class);
        userService = new UserService(userDAO);
    }

    @Test
    public void testRegisterUser() {
        User user = new User();
        user.setEmail("register@example.com");
        user.setPassword("password123");
        user.setName("New User");

        when(userDAO.saveUser(user)).thenReturn(true);

        boolean isRegistered = userService.registerUser(user);
        assertTrue(isRegistered, "User should be registered successfully");
        verify(userDAO, times(1)).saveUser(user);
    }

    @Test
    public void testLoginUser() {
        User user = new User();
        user.setEmail("login@example.com");
        user.setPassword("password123");
        user.setName("Login User");

        when(userDAO.getUserByEmail("login@example.com")).thenReturn(user);

        User loggedInUser = userService.loginUser("login@example.com", "password123");
        assertNotNull(loggedInUser, "User should be logged in successfully");
        assertEquals("Login User", loggedInUser.getName(), "User name should match");
    }

    @Test
    public void testUpdateUserProfile() {
        User user = new User();
        user.setEmail("update@example.com");
        user.setPassword("password123");
        user.setName("Update User");

        when(userDAO.saveUser(user)).thenReturn(true);

        user.setName("Updated User");
        boolean isUpdated = userService.updateUserProfile(user);

        assertTrue(isUpdated, "User profile should be updated successfully");
        verify(userDAO, times(1)).updateUser(user);
    }

    @Test
    public void testDeleteUser() {
        User user = new User();
        user.setEmail("delete@example.com");
        user.setPassword("password123");
        user.setName("Delete User");

        when(userDAO.saveUser(user)).thenReturn(true);

        boolean isDeleted = userService.deleteUser(user.getId());
        assertTrue(isDeleted, "User should be deleted successfully");
        verify(userDAO, times(1)).deleteUser(user.getId());
    }
}
