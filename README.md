Authfy - Enterprise API Management SaaS

A secure, developer-focused Identity & Access Management (IAM) platform that allows SaaS companies to issue, manage, and validate API keys for their own customers.

📖 Overview

Authfy is a full-stack microservices application designed to solve the "API Authentication" problem for developers. Instead of building complex key management systems from scratch, developers can use Authfy to generate secure, hashed API keys and validate them via a high-performance Spring Boot middleware.

Key Capabilities:

Identity Provider: Full user registration, login (JWT), and email verification.

Key Management: Generate, list, and revoke API keys instantly.

Security: Zero-knowledge architecture (Keys are hashed SHA-256), Stateless Authentication.

DevOps: Fully containerized architecture using Docker & Nginx.

🚀 Tech Stack & Architecture

The project follows a Microservices Architecture orchestrated via Docker Compose.

Component

Technology

Description

Frontend

React.js + Vite

Built with Tailwind CSS, served via Nginx (Alpine Linux).

Backend

Spring Boot 3

Java 21 API handling Auth, Keys, and Validation Logic.

Database

MySQL 8.0

Persistent storage for Users and Hashed Keys.

Security

Spring Security 6

Custom Filter Chains for JWT & API Key validation.

DevOps

Docker

Multi-Stage Builds for optimized, secure images.

🛠️ Quick Start (Run Locally)

You can run the entire infrastructure with a single command. No Java or Node.js installation required.

Prerequisites

Docker Desktop (Running)

Git

Installation

Clone the repository

git clone [https://github.com/YOUR_USERNAME/Authfy-Dockerized-SaaS.git](https://github.com/YOUR_USERNAME/Authfy-Dockerized-SaaS.git)
cd Authfy-Dockerized-SaaS


Start the Application
Run this command to build images and start containers:

docker-compose up --build


Access the App

Frontend (UI): http://localhost:3000

Backend (API): http://localhost:8080

Stop the App

docker-compose down


📂 Project Structure

Authfy-Dockerized-SaaS/
├── docker-compose.yml      # Main Orchestration File (Full Stack)
│
├── backend/                # Spring Boot Microservice
│   ├── Dockerfile          # Multi-Stage Java 21 Build (Maven -> JRE)
│   ├── src/
│   └── pom.xml
│
└── client/                 # React Frontend
    ├── Dockerfile          # Multi-Stage Node + Nginx Build
    ├── nginx.conf          # Custom Nginx Router for React
    ├── src/
    └── package.json


🔒 Security & DevOps Features

1. Multi-Stage Docker Builds

We use multi-stage builds to keep production images small and secure. Source code is compiled in the first stage and discarded, leaving only the compiled artifacts (JAR / Static Files) in the final image.

2. Nginx Reverse Proxy

The frontend container uses a custom nginx.conf to handle React routing (Single Page Application support), preventing 404 errors on refresh.

3. CORS Configuration

The Spring Boot backend is configured to securely accept requests from:

Production: Docker Container (http://localhost:3000)

Development: Local Vite Server (http://localhost:5173)

4. API Key Security

Keys are generated using SecureRandom and never stored in plain text.

User sees: sk_live_a1b2... (Only once upon creation).

Database stores: SHA-256(sk_live_a1b2...).

Validation: Incoming keys are hashed and compared against the DB.

🧪 Testing the API

You can test the security filter using curl or Postman.

1. Valid Request:

curl -H "x-api-key: sk_live_YOUR_KEY" http://localhost:8080/api/v1/keys
# Returns 200 OK


2. Invalid Request:

curl -H "x-api-key: sk_live_FAKE_KEY" http://localhost:8080/api/v1/keys
# Returns 401 Unauthorized


🔮 Future Roadmap

[ ] Cloud Deployment: Deploy to AWS EC2 using Terraform.

[ ] CI/CD: Implement GitHub Actions for automated testing and image building.

[ ] Rate Limiting: Add Redis to throttle API usage per key.
