# Authfy — Enterprise API Management SaaS

<img width="741" height="522" alt="System Architecture drawio" src="https://github.com/user-attachments/assets/739a238f-08ad-4511-b057-4bb1a6ab8064" />


A secure, developer-focused Identity & Access Management (IAM) platform that lets SaaS teams issue, manage, and validate API keys for their customers — without reinventing key management.

## Overview

Authfy is a full-stack microservices application that solves the "API authentication" problem for developers. Instead of building complex key management systems from scratch, Authfy generates secure, hashed API keys and validates them using a high-performance Spring Boot middleware.

Key highlights:
- Zero-knowledge API key storage (keys are hashed with SHA-256)
- Fast, stateless validation middleware
- Developer-first UX for key issuance, listing, and revocation
- Containerized for easy local development and deployment

## Key Capabilities

- Identity Provider
  - User registration and login with JWT
  - Email verification workflows
- Key Management
  - Generate API keys (displayed once)
  - List and revoke keys instantly
- Security
  - Keys are never stored in plaintext — only SHA-256 hashes are persisted
  - Stateless validation: incoming keys are hashed and compared to stored hashes
- DevOps
  - Fully containerized with multi-stage Docker builds
  - Frontend served behind Nginx

## Tech Stack & Architecture

- Frontend: React.js + Vite, Tailwind CSS, served via Nginx (Alpine)
- Backend: Spring Boot 3 (Java 21)
- Database: MySQL 8.0
- Security: Spring Security 6 with custom filter chains for JWT & API key validation
- DevOps: Docker / Docker Compose for orchestration

The project follows a microservices architecture and is orchestrated via Docker Compose for local development.



## Quick Start (Run locally)

No Java or Node installation required — Docker handles everything.

Prerequisites
- Docker Desktop (running)
- Git

Installation
1. Clone the repo
     git clone https://github.com/AuthnSapuarachchi/Authfy-Dockerized-SaaS.git
   cd Authfy-Dockerized-SaaS

2. Build images and start containers
   docker-compose up --build

3. Access the app
   - Frontend (UI): http://localhost:3000
   - Backend (API): http://localhost:8080

4. Stop the app
   docker-compose down

## Security & DevOps Features

1. Multi-stage Docker builds
   - Builds artifacts in a builder stage and produces minimal production images.

2. Nginx reverse proxy for frontend
   - Custom nginx.conf handles SPA routing to prevent 404s on refresh.

3. CORS configuration
   - Backend configured to accept:
     - Production (container): http://localhost:3000
     - Development (Vite): http://localhost:5173

4. API key security
   - Keys are generated using SecureRandom and shown to users only once (e.g., sk_live_a1b2...).
   - Only the SHA-256 hash is stored in the database.
   - Validation hashes the incoming key and compares against stored hashes.

## Testing the API

Use curl or Postman to test the API key validation filter.

1. Valid request
   curl -H "x-api-key: sk_live_YOUR_KEY" http://localhost:8080/api/v1/keys
   # -> 200 OK

2. Invalid request
   curl -H "x-api-key: sk_live_FAKE_KEY" http://localhost:8080/api/v1/keys
   # -> 401 Unauthorized

## Recommended Improvements / Roadmap

- [ ] Cloud deployment (e.g., AWS EC2) using Terraform
- [ ] CI/CD: GitHub Actions for automated tests and image builds
- [ ] Rate limiting: Add Redis to throttle requests per API key
- [ ] Observability: Add Prometheus + Grafana for metrics and alerts
- [ ] Secrets management: Integrate Vault or cloud KMS for secrets


## Contact

Maintainer: Tharusha Mdhusankha

