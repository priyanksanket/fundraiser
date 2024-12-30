# Test Plan for Fundraiser Project

This document outlines the test strategy, scope, objectives, and types of tests that will be performed for the **Fundraiser** project to ensure the application works as intended.

## Table of Contents
1. [Introduction](#introduction)
2. [Test Objectives](#test-objectives)
3. [Test Scope](#test-scope)
4. [Test Types](#test-types)
    - [Unit Testing](#unit-testing)
    - [Integration Testing](#integration-testing)
    - [Functional Testing](#functional-testing)
    - [Security Testing](#security-testing)
    - [Performance Testing](#performance-testing)
5. [Test Environment](#test-environment)
6. [Test Strategy](#test-strategy)
7. [Test Cases](#test-cases)
8. [Test Schedule](#test-schedule)
9. [Test Deliverables](#test-deliverables)
10. [Conclusion](#conclusion)

---

## Introduction

This Test Plan provides a comprehensive approach to testing the **Fundraiser** project, ensuring that the system meets its functional, security, and performance requirements. The application is designed to allow users to register, log in, create fundraising projects, make donations, and manage their profiles.

---

## Test Objectives

The main objectives of this testing effort are to:
1. Ensure that all user stories and use cases are implemented as expected.
2. Validate that the application meets its functional requirements, including user registration, login, project creation, and donation processing.
3. Identify and address any issues related to security, performance, and usability.
4. Ensure that the application is stable and performs well under different conditions.

---

## Test Scope

This Test Plan covers the following areas:
1. **Frontend Testing**: Ensuring the UI is user-friendly, responsive, and functional across different devices and browsers.
2. **Backend Testing**: Verifying that all backend functionality (user registration, project creation, donations, etc.) works as expected.
3. **Security Testing**: Ensuring that the application is secure and protected from common vulnerabilities (e.g., SQL injection, XSS).
4. **Performance Testing**: Testing the system's ability to handle a large number of concurrent users and requests.

---

## Test Types

### Unit Testing

- **Objective**: Test individual units of the application (e.g., functions, methods) to ensure they work as expected in isolation.
- **Tools**: **JUnit**, **Mockito**
- **Scope**:
    - Test DAOs, services, and utility classes.
    - Test edge cases, exception handling, and validation methods.

### Integration Testing

- **Objective**: Verify that different components of the system work together as expected.
- **Tools**: **JUnit**, **Mockito**
- **Scope**:
    - Test the integration between the frontend and backend.
    - Verify communication between the web layer (Servlets) and the database.

### Functional Testing

- **Objective**: Ensure that the application’s features work as expected in real-world scenarios.
- **Scope**:
    - User registration and login.
    - Creating, editing, and deleting projects.
    - Making donations and viewing donation history.
    - Profile management.
    - Testing JSP pages with JSTL and EL to ensure dynamic data is rendered correctly.

### Security Testing

- **Objective**: Identify potential security vulnerabilities in the application.
- **Scope**:
    - Test for common security vulnerabilities such as SQL injection, cross-site scripting (XSS), and session hijacking.
    - Ensure password hashing and user authentication are secure.
    - Verify that sensitive data is not exposed in error messages or logs.

### Performance Testing

- **Objective**: Test the application's scalability and responsiveness under load.
- **Tools**: **Apache JMeter**, **Gatling**
- **Scope**:
    - Measure response times for key functionality such as login, registration, project creation, and donation processing.
    - Test the system’s ability to handle multiple concurrent users and large amounts of data.

---

## Test Environment

The tests will be conducted in the following environment:

- **Development Environment**:
    - IDE: **IntelliJ IDEA**
    - Database: **MySQL**
    - Web Server: **Apache Tomcat**
    - Operating System: **Windows** (for local testing) and **Linux** (for staging/production testing)

- **Test Environment**:
    - Staging server with the same configuration as production.
    - Testing tools like **JUnit**, **Selenium** (for UI testing), and **Apache JMeter**.

---

## Test Strategy

1. **Automated Testing**:
    - Unit and integration tests will be automated using **JUnit** and **Mockito**.
    - UI tests will be automated using **Selenium** to simulate user interactions.

2. **Manual Testing**:
    - Functional testing will be performed manually to ensure the application behaves as expected.
    - Exploratory testing will be conducted to identify any edge cases or unexpected behavior.

---

## Test Cases

Here are a few examples of test cases for critical functionality:

### User Registration Test Case
- **Test Objective**: Verify that a new user can register successfully.
- **Test Steps**:
    1. Navigate to the signup page.
    2. Enter valid details (first name, last name, email, password).
    3. Click the "Register" button.
    4. Verify that the user is redirected to the login page.
    5. Check the database to ensure the user is created.
- **Expected Outcome**: The user is created and stored in the database.

### Login Test Case
- **Test Objective**: Verify that users can log in with valid credentials.
- **Test Steps**:
    1. Navigate to the login page.
    2. Enter valid email and password.
    3. Click the "Login" button.
    4. Verify that the user is redirected to the home page.
- **Expected Outcome**: The user is logged in and redirected to the home page.

### Project Creation Test Case
- **Test Objective**: Verify that a user can create a new fundraising project.
- **Test Steps**:
    1. Log in as a user.
    2. Navigate to the project creation page.
    3. Enter valid project details (title, description, goal amount).
    4. Submit the form.
    5. Verify that the project is stored in the database.
    6. Verify that the user is redirected to the project details page.
- **Expected Outcome**: The project is created and displayed correctly.

---

## Test Schedule

| Test Phase            | Start Date   | End Date     | Responsible |
|-----------------------|--------------|--------------|-------------|
| Unit Testing          | 2024-01-01   | 2024-01-05   | Developer   |
| Integration Testing   | 2024-01-06   | 2024-01-10   | Developer   |
| Functional Testing    | 2024-01-11   | 2024-01-15   | QA Team     |
| Security Testing      | 2024-01-16   | 2024-01-20   | QA Team     |
| Performance Testing   | 2024-01-21   | 2024-01-25   | QA Team     |
| Final Regression Test | 2024-01-26   | 2024-01-28   | QA Team     |

---

## Test Deliverables

- **Test Plan Document**: This document.
- **Test Cases**: A list of test cases with details about each.
- **Test Scripts**: Automated test scripts for unit, integration, and UI tests.
- **Test Logs**: Logs from automated and manual tests.
- **Bug Reports**: Report of any issues or defects found during testing.
- **Test Summary Report**: A final report summarizing the test results, including the number of test cases passed, failed, and pending.

---

## Conclusion

The test plan for the **Fundraiser** project aims to ensure the application’s quality, security, and performance before production deployment. The testing will be comprehensive, covering functional, integration, security, and performance aspects. By following this plan, we will be able to identify and resolve any issues before the project is released to end users.
