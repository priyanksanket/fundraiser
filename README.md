# Fundraiser - Crowdfunding Platform

A web-based crowdfunding platform where fundraisers can create campaigns and backers can contribute to support their projects. This project is developed using Java Spring Boot, MySQL, HTML, CSS, and JavaScript, designed to handle project listings, donations, user management, and secure transactions.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Database Structure](#database-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Fundraiser is a platform that allows users to create, manage, and fund projects. Fundraisers can submit projects for funding, and backers can view project listings, choose to support them, and track the project's progress. The admin role enables oversight for project approval and monitoring transactions.

## Features

- **User Authentication**: Secure registration and login with role-based access for backers, fundraisers, and admins.
- **Project Management**: Create, edit, and view projects with specific target amounts and descriptions.
- **Donation Processing**: Allow backers to donate to projects and track donations.
- **Transaction Logging**: Record all transactions for transparency and history tracking.
- **Project Updates**: Enable fundraisers to post updates to keep backers informed.
- **Admin Dashboard**: Approve/reject projects, view transaction logs, and manage users.

## Technology Stack

- **Backend**: Java Spring Boot, Spring Data JPA, Spring Security
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Database**: MySQL
- **Additional Libraries**: 
  - BCrypt for password hashing
  - JavaMail for email notifications (optional)
  - Stripe API for payment processing (optional)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Java Development Kit (JDK) 8+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Apache Maven](https://maven.apache.org/)
- [MySQL](https://www.mysql.com/downloads/)
- A Java IDE (IntelliJ, Eclipse, or similar)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/username/fundraiser.git
    ```

2. Navigate into the project directory:

    ```bash
    cd fundraiser
    ```

3. Install the required dependencies using Maven:

    ```bash
    mvn clean install
    ```

4. Set up the MySQL database and update the `application.properties` file with your database configuration:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/fundraiser
    spring.datasource.username=root
    spring.datasource.password=yourpassword
    spring.jpa.hibernate.ddl-auto=update
    ```

5. Run the Spring Boot application:

    ```bash
    mvn spring-boot:run
    ```

6. Open a browser and navigate to `http://localhost:8080` to access the application.

### Database Structure

The following are the main tables in the database:

- **Users**: Stores user info, roles, and encrypted passwords.
- **Projects**: Holds project details such as title, description, target amount, and current funding.
- **Donations**: Tracks each donation with details on the donor, project, and amount.
- **Transaction Logs**: Records all transaction activities for review and audit purposes.

Refer to the `schema.sql` file for detailed table definitions.

## Usage

- **Backers**: Register or log in to browse and donate to listed projects.
- **Fundraisers**: Register, create new project listings, and post updates on progress.
- **Admins**: Log in to manage user accounts, review and approve projects, and monitor transactions.

### Example API Endpoints

- **User Registration**: `/api/register`
- **Login**: `/api/login`
- **Create Project**: `/api/projects/new`
- **Donate to Project**: `/api/projects/{id}/donate`
- **Get Project List**: `/api/projects`

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

### Acknowledgments

Special thanks to the Java Spring Boot and open-source community for the resources and tools to make this project possible.
