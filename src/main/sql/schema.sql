-- schema.sql

-- Create the database
CREATE DATABASE IF NOT EXISTS fundraiser_db;
USE fundraiser_db;

-- Table for Users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Projects
CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(10, 2) NOT NULL,
    raised_amount DECIMAL(10, 2) DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Donations
CREATE TABLE IF NOT EXISTS donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    donor_name VARCHAR(100),
    donor_email VARCHAR(100),
    project_id INT,
    user_id INT,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Add indexes for faster lookup on frequently queried fields
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_project_title ON projects(title);
CREATE INDEX idx_donation_project_id ON donations(project_id);

-- Sample admin user
INSERT INTO users (first_name, last_name, email, password, role)
VALUES ('Admin', 'User', 'admin@fundraiser.com', '$2a$12$GeMw7y5UHYj3G1VR8p6f/Of0sq.9zo19nIHbZDkk0a/D0w9HLZbYu', 'ADMIN');

-- Add a couple of sample projects
INSERT INTO projects (title, description, goal_amount, user_id, end_date)
VALUES ('Save the Oceans', 'A campaign to raise awareness and funds to save the oceans.', 10000.00, 1, '2024-12-31'),
       ('Help the Homeless', 'A campaign to raise funds to provide shelter and food for homeless people.', 5000.00, 1, '2024-11-30');

-- Add some donations to the projects
INSERT INTO donations (amount, donor_name, donor_email, project_id, user_id)
VALUES (50.00, 'John Doe', 'johndoe@example.com', 1, 1),
       (100.00, 'Jane Smith', 'janesmith@example.com', 2, 1);
