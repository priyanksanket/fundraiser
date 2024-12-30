# Design Document for Fundraiser Project

This design document provides an overview of the architecture, components, and key features of the **Fundraiser** project. The project allows users to register, log in, create and manage fundraising campaigns, and make donations.

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [Key Components](#key-components)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Authentication](#authentication)
5. [Use Cases](#use-cases)
6. [Technologies Used](#technologies-used)
7. [Design Principles](#design-principles)
8. [Security Considerations](#security-considerations)
9. [Testing Strategy](#testing-strategy)
10. [Future Enhancements](#future-enhancements)

---

## Introduction

The **Fundraiser** project is a web-based platform designed to facilitate the creation and management of fundraising campaigns. It allows users to:
- Register and log in to their accounts.
- Create new projects with a fundraising goal.
- Make donations to projects.
- View and manage their profiles and the projects they’ve created.

This document describes the system's architecture, its key components, and how each piece of functionality is designed and implemented.

---

## System Architecture

The **Fundraiser** system follows a **Model-View-Controller (MVC)** architecture. The components are divided as follows:

- **Model**: Represents the application's data structure, including users, projects, and donations. It also handles business logic such as user authentication, project creation, and donation handling.
- **View**: The frontend of the application, responsible for displaying the data to the user and providing an interface for interaction. It is built using HTML, CSS, and JavaScript (JSP is used for dynamic content generation).
- **Controller**: The backend of the application, where requests are processed and the appropriate responses are generated. Servlets act as controllers, handling HTTP requests and invoking methods from the model.

---

## Database Design

The database is structured to store information about users, projects, donations, and the relationships between them. The main tables in the schema are:

- **users**
    - Stores user information such as first name, last name, email, password (hashed), and role (user/admin).

- **projects**
    - Stores information about fundraising projects such as title, description, goal amount, end date, and project creator.

- **donations**
    - Stores donations made to projects, including the amount donated, the donor's details, and the associated project.

### Entity Relationship Diagram (ERD)
- Users can create many projects (One-to-Many relationship between `users` and `projects`).
- Users can make many donations to projects (Many-to-Many relationship between `users` and `projects` through `donations`).

### Tables
1. **users**
    - `user_id` (Primary Key)
    - `first_name`
    - `last_name`
    - `email`
    - `password`
    - `role`

2. **projects**
    - `project_id` (Primary Key)
    - `title`
    - `description`
    - `goal_amount`
    - `end_date`
    - `user_id` (Foreign Key referencing `users`)

3. **donations**
    - `donation_id` (Primary Key)
    - `amount`
    - `user_id` (Foreign Key referencing `users`)
    - `project_id` (Foreign Key referencing `projects`)

---

## Key Components

### Frontend
- The frontend is built using **HTML**, **CSS**, and **JavaScript**.
- **JSP** is used for rendering dynamic content on pages such as the homepage, project details, and user profile.
- **Bootstrap** is used for responsive design to ensure the app works well on both desktop and mobile devices.

### Backend
- **Servlets** handle HTTP requests. Each servlet is associated with a specific function, such as handling user login (`LoginServlet`), user registration (`SignupServlet`), project management (`ProjectServlet`), and donations (`DonationServlet`).
- **JSP** pages are used to display data to the user, with **JSTL** (JavaServer Pages Standard Tag Library) and **Expression Language (EL)** for accessing data in the views.
- **DAO (Data Access Object)** design pattern is used to interact with the database (e.g., `UserDAO`, `ProjectDAO`, `DonationDAO`).

### Database
- The project uses **MySQL** for the database, with tables created via SQL scripts.
- Database interactions are handled using **JDBC** through DAOs. The database connection details are stored in the `database.properties` file.

### Authentication
- Users can register and log in to the system.
- Passwords are hashed using **bcrypt** and stored in the database.
- Sessions are used to manage user authentication. After successful login, a session is created, and users are redirected to the home page.
- Users are logged out by destroying the session and redirected back to the welcome page.

---

## Use Cases

1. **User Registration**
    - The user registers by providing their first name, last name, email, and password.
    - On successful registration, the user is redirected to the login page.

2. **User Login**
    - The user enters their email and password to log in.
    - On successful login, the user is redirected to the home page, where they can view and manage projects.

3. **Creating a Project**
    - A logged-in user can create a new project by providing a title, description, and fundraising goal amount.
    - The project is saved in the database, and the user is redirected to the project details page.

4. **Making a Donation**
    - A logged-in user can make a donation to a project by providing the donation amount.
    - The donation is recorded in the database, and the user is shown a confirmation page.

5. **User Profile Management**
    - The user can view and update their profile details such as their name and email.

---

## Technologies Used

- **Java** (for backend development with Servlets and JSP)
- **MySQL** (for database)
- **JDBC** (for database connection)
- **JSP** (for dynamic web pages)
- **HTML/CSS/JavaScript** (for frontend development)
- **Bootstrap** (for responsive design)
- **JSTL** and **EL** (for dynamic content in JSP)
- **Log4j** (for logging)
- **JUnit** (for unit testing)
- **BCrypt** (for password hashing)
- **Maven** (for project management)

---

## Design Principles

- **Separation of Concerns**: The application follows the MVC (Model-View-Controller) pattern, separating the data layer, business logic, and presentation logic.
- **Modularity**: The system is divided into small, manageable components such as DAOs, services, and servlets, which ensures maintainability and scalability.
- **User-Centered Design**: The user interface is designed to be simple, clean, and responsive, ensuring ease of use for all users.

---

## Security Considerations

- **Password Hashing**: Passwords are hashed using **bcrypt** before being stored in the database, ensuring that even if the database is compromised, user passwords are not exposed.
- **Session Management**: User sessions are securely managed using **HTTP sessions**. Sessions are invalidated upon logout.
- **SQL Injection Protection**: All database queries are executed using prepared statements to avoid SQL injection attacks.

---

## Testing Strategy

- **Unit Tests**: Unit tests are written for key components such as DAOs and services using **JUnit** to ensure the business logic works as expected.
- **Integration Tests**: End-to-end tests are performed to ensure that the entire flow (from user registration to donation processing) works seamlessly.
- **Manual Testing**: The frontend is manually tested on different browsers and devices to ensure responsiveness and usability.

---

## Future Enhancements

- **Admin Panel**: An admin panel could be implemented to allow admins to manage users, projects, and donations.
- **Email Notifications**: Implement email notifications for actions like project creation, donation confirmation, and profile updates.
- **Social Media Integration**: Allow users to share projects on social media platforms for wider reach.
- **Payment Gateway Integration**: Integrate a payment gateway (e.g., PayPal, Stripe) for secure donation processing.

---

## Conclusion

The **Fundraiser** project is designed with scalability, security, and usability in mind. With a clear separation of concerns and the use of standard Java web technologies, the project aims to provide a seamless experience for users to create, manage, and support fundraising campaigns.
