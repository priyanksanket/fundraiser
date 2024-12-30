# Fundraiser Web Application

## Overview

The **Fundraiser Web Application** is a crowdfunding platform that allows users to create and manage fundraising campaigns. The platform is designed for individuals and organizations to collect donations for various causes. Users can sign up, log in, create projects, and contribute to campaigns. The application is built using Java, JSP, Servlets, MySQL, and other technologies.

This project is developed as part of a college assignment and follows a **Maven-based architecture**.

## Features

- **User Authentication**: Users can sign up and log in using email and password. Passwords are securely hashed using BCrypt.
- **Project Management**: Users can create fundraising projects, view details, and update project information.
- **Database Integration**: MySQL is used to store user and project data.
- **JSP Pages**: Dynamically rendered JSP pages for user interactions.
- **JSTL (JavaServer Pages Standard Tag Library)**: Helps with the integration of logic in JSP files using tags.
- **Form Validation**: Client-side and server-side validation for forms like sign up, login, and project creation.
- **Error Handling**: Custom error handling through servlets.

## Technology Stack

### Frontend:
- **HTML**: Markup language for web pages.
- **CSS**: Styling language used for layout and design.
- **JavaScript**: Used for form validation and interactivity.
- **JSP (JavaServer Pages)**: Used for rendering dynamic web pages.
- **JSTL (JavaServer Pages Standard Tag Library)**: Helps with the integration of logic in JSP files using tags.

### Backend:
- **Java (JDK 8)**: Core programming language used to build the application’s logic.
- **Servlets**: Used for handling HTTP requests and responses, business logic processing, and page routing.
- **JSP**: Integrated with Servlets for dynamic content rendering.

### Database:
- **MySQL**: Database management system used for storing user and project data.

### Logging:
- **Log4j**: Used for logging application activities and errors.

### Testing:
- **JUnit**: Unit testing framework for testing DAOs, services, and servlets.

## API Endpoints

Here is an overview of the key API endpoints exposed by the application:

### 1. **Authentication**
- **POST `/login`**: Authenticates a user based on email and password.
- **POST `/signup`**: Registers a new user with email, password, and other information.
- **GET `/logout`**: Logs out the current user and redirects to the welcome page.

### 2. **User Profile**
- **GET `/profile`**: Displays the user’s profile with their details.
- **POST `/profile/update`**: Updates user information.

### 3. **Projects**
- **POST `/project/create`**: Creates a new fundraising project.
- **GET `/project/{id}`**: Displays the details of a specific project.
- **GET `/projects`**: Displays a list of all projects.

### 4. **Error Handling**
- **GET `/error`**: Handles custom errors (e.g., 404, 500).


## Database Configuration

Database configuration is stored in `database.properties`. It includes the necessary parameters such as the MySQL connection string, username, and password.

```properties
# Database connection properties
db.url=jdbc:mysql://localhost:3306/fundraiser_db
db.username=root
db.password=12345678



