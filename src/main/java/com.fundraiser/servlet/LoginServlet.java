package com.fundraiser.servlet;

import com.fundraiser.service.UserService;
import com.fundraiser.model.User;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {

    private UserService userService;

    @Override
    public void init() throws ServletException {
        this.userService = new UserService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // If the user is already logged in, redirect them to the home page
        if (request.getSession().getAttribute("user") != null) {
            response.sendRedirect("home");
            return;
        }
        // Otherwise, show the login page
        RequestDispatcher dispatcher = request.getRequestDispatcher("login.jsp");
        dispatcher.forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the form data
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Validate the login credentials
        if (userService.validateLogin(email, password)) {
            // If login is successful, create a session and redirect to home
            HttpSession session = request.getSession();
            User user = userService.getUserByEmail(email).get();
            session.setAttribute("user", user);
            response.sendRedirect("home");
        } else {
            // If login fails, set error message and redirect back to login
            request.setAttribute("error", "Invalid email or password");
            RequestDispatcher dispatcher = request.getRequestDispatcher("login.jsp");
            dispatcher.forward(request, response);
        }
    }
}
