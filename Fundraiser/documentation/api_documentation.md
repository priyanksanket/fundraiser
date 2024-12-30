# API Documentation

This document provides details about the available API endpoints for the **Fundraiser** project. The application allows users to register, log in, create and view projects, make donations, and manage their profile.

## Base URL
The base URL for all API endpoints is:http://localhost:8080/fundraiser


## Authentication

All endpoints, except for `signup`, `login`, and `welcome`, require the user to be authenticated. Authentication is done via **session-based login**. Once logged in, the user's session is maintained across requests until logout.

### Endpoints

### 1. **User Authentication**

#### POST /login
Logs in a user by verifying the provided credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
