package com.fundraiser.dao;

import com.fundraiser.model.User;
import org.junit.jupiter.api.*;
import java.sql.*;
import static org.junit.jupiter.api.Assertions.*;

public class UserDAOTest {

    private static UserDAO userDAO;
    private static Connection connection;

    @BeforeAll
    public static void setUp() throws SQLException {
        // Set up an in-memory H2 database for testing
        connection = DriverManager.getConnection("jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1", "sa", "");
        connection.createStatement().execute("CREATE TABLE users (id INT AUTO_INCREMENT, email VARCHAR(255) UNIQUE, password VARCHAR(255), name VARCHAR(255))");

        userDAO = new UserDAO();
    }

    @AfterAll
    public static void tearDown() throws SQLException {
        // Clean up and close the in-memory database
        connection.createStatement().execute("DROP TABLE users");
        connection.close();
    }

    @Test
    public void testSaveUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setName("Test User");

        boolean isSaved = userDAO.saveUser(user);
        assertTrue(isSaved, "User should be saved successfully");
    }

    @Test
    public void testGetUserById() {
        User user = new User();
        user.setEmail("test2@example.com");
        user.setPassword("password456");
        user.setName("Test User 2");
        userDAO.saveUser(user);

        User retrievedUser = userDAO.getUserById(1);
        assertNotNull(retrievedUser, "User should be found by ID");
        assertEquals("Test User 2", retrievedUser.getName(), "User name should match");
    }

    @Test
    public void testGetUserByEmail() {
        User user = new User();
        user.setEmail("test3@example.com");
        user.setPassword("password789");
        user.setName("Test User 3");
        userDAO.saveUser(user);

        User retrievedUser = userDAO.getUserByEmail("test3@example.com");
        assertNotNull(retrievedUser, "User should be found by email");
        assertEquals("Test User 3", retrievedUser.getName(), "User name should match");
    }

    @Test
    public void testUpdateUser() {
        User user = new User();
        user.setEmail("update@example.com");
        user.setPassword("update123");
        user.setName("Update User");
        userDAO.saveUser(user);

        user.setName("Updated User");
        boolean isUpdated = userDAO.updateUser(user);

        User updatedUser = userDAO.getUserById(1);
        assertTrue(isUpdated, "User should be updated successfully");
        assertEquals("Updated User", updatedUser.getName(), "User name should be updated");
    }

    @Test
    public void testDeleteUser() {
        User user = new User();
        user.setEmail("delete@example.com");
        user.setPassword("delete123");
        user.setName("Delete User");
        userDAO.saveUser(user);

        boolean isDeleted = userDAO.deleteUser(1);
        User deletedUser = userDAO.getUserById(1);

        assertTrue(isDeleted, "User should be deleted successfully");
        assertNull(deletedUser, "User should not be found after deletion");
    }
}
