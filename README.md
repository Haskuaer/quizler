# Quizler

A web-based quiz application developed as a university project using Node.js, Express.js, EJS, and MongoDB.

## About

Quizler is an interactive quiz platform that allows users to test their knowledge, manage their profiles, and track quiz results.

The project focuses on user authentication, role-based access control, database operations, and interactive quiz functionality.

Currently, the application includes a flag recognition quiz.

## Features

#### user Roles & Permissions

**Guest (Unauthenticated User)**

- Browse and solve available quizzes
- Access public pages
- Register or log in

**Registered User**

- All guest functionalities
- Edit profile information
- Save quiz results
- Like quizzes and access them through a favorites section

**Administrator**

- Manage users
- Manage quizzes
- Access administrative management features

## Quiz System

- Interactive flag recognition quiz
- Question navigation
- Time-limited quiz sessions
- Quiz completion and result calculation

## Authentication

- User registration and login
- JWT-based authentication
- Password hashing
- Role-based access control

## Technologies

#### Backend

- Node.js
- Express.js

 #### Frontend

 - EJS
 - HTML5
 - CSS3
 - JavaScript

#### Database

- MongoDB
- Mongoose

#### Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt
- Helmet
- CSRF protection
- Express Rate Limit
- Express Validator

#### Additional Tools

- dotenv
- cookie-parser
- express-session
- express-flash
- nodemon

## Project Structure

The application follows a modular structure, separating routes, application logic, database models, middleware, and frontend views.

EJS templates are used to render the user interface, while Express.js handles routing, authentication, and application logic.

## Status

**Functional Academic Project** - The core application features are implemented and functional.

The current version includes one flag recognition quiz. Additional quizzes and a leaderboard were part of the original concept but have not been implemented.

## Future Improvements

- Additional quiz categories
- Leaderboard and ranking system
- Further UI/UX improvements
