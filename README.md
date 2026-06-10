# URL Shortener

A full-stack URL shortening service that allows users to create, manage, and analyze shortened URLs. The application provides secure authentication, custom short links, click tracking, and analytics through a modern and responsive dashboard.

## Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://url-shortener-sooty-chi.vercel.app/)

---

## Features

### URL Management

* Create short URLs
* Create custom short URLs
* Add titles and descriptions
* Set expiration dates
* Activate and deactivate URLs
* Delete URLs
* Search and manage URLs through a dashboard

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Remember Me Support

### Analytics

* Total Click Tracking
* Daily Click Statistics
* Referrer Analytics
* Country-wise Analytics

### Public Access

* Public URL shortening without authentication
* Fast URL redirection using short links

### User Experience

* Responsive design
* Modern dashboard interface
* Copy-to-clipboard functionality
* Search and pagination support

---

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | Next.js, React, TypeScript, CSS Modules |
| Backend        | Spring Boot, Java 17, Gradle            |
| Database       | PostgreSQL                              |
| Authentication | JWT, BCrypt                             |
| Charts         | Recharts                                |
| Icons          | Font Awesome, React Icons               |

---

## Project Structure

```text
├── app/                    # Next.js App Router pages
├── backend/                # Spring Boot backend
├── gradle/                 # Gradle wrapper files
├── public/                 # Static assets
├── .gitignore
├── README.md
├── eslint.config.mjs
├── gradlew
├── gradlew.bat
├── next.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

* Node.js
* Java 17 JDK
* PostgreSQL

### Installation

```bash
git clone https://github.com/Ankit-34095/Url-Shortener.git
cd Url-Shortener

# Install frontend dependencies
npm install

# Build backend
cd backend
./gradlew bootJar
```

---

## Running Locally

### Backend

```bash
cd backend
./gradlew bootRun
```

Backend runs on:

```text
http://localhost:8081
```

### Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Deployment

### Backend (Render)

* Dockerized Spring Boot deployment
* PostgreSQL database integration
* Environment-based configuration

### Frontend (Vercel)

* Next.js deployment on Vercel
* Connected to the deployed Spring Boot backend

---

## Screenshots

### Home Page

*Add screenshot here*

### Dashboard

*Add screenshot here*

### Analytics

*Add screenshot here*
