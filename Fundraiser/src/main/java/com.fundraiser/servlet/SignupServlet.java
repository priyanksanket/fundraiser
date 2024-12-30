package com.fundraiser.servlet;

import com.fundraiser.dao.UserDAO;
import com.fundraiser.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet to handle user registration (sign-up).
 */
@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        String jdbcURL = getServletContext().getInitParameter("jdbcURL");
        String jdbcUsername = getServletContext().getInitParameter("jdbcUsername");
        String jdbcPassword = getServletContext().getInitParameter("jdbcPassword");
        userDAO = new UserDAO(jdbcURL, jdbcUsername, jdbcPassword);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get user details from the form
        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        // Validate input
        String errorMessage = validateInputs(fullName, email, password, confirmPassword);
        if (errorMessage != null) {
            request.setAttribute("error", errorMessage);
            request.getRequestDispatcher("signup.jsp").forward(request, response);
            return;
        }

        // Create a new User object
        User newUser = new User();
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        newUser.setPassword(password); // Consider hashing the password before storing

        // Register the user
        boolean isUserRegistered = userDAO.registerUser(newUser);
        if (isUserRegistered) {
            response.sendRedirect("login.jsp?success=1");
        } else {
            request.setAttribute("error", "Failed to register. Email might already be in use.");
            request.getRequestDispatcher("signup.jsp").forward(request, response);
        }
    }

    /**
     * Validates input data from the user registration form.
     *
     * @param fullName        The full name of the user.
     * @param email           The email address of the user.
     * @param password        The password entered by the user.
     * @param confirmPassword The confirmation password.
     * @return An error message if validation fails, null otherwise.
     */
    private String validateInputs(String fullName, String email, String password, String confirmPassword) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "Full name is required.";
        }
        if (email == null || email.trim().isEmpty()) {
            return "Email is required.";
        }
        if (password == null || password.trim().isEmpty()) {
            return "Password is required.";
        }
        if (!password.equals(confirmPassword)) {
            return "Passwords do not match.";
        }
        return null;
    }
}

