# Tashkeel Backend

Backend API for the Tashkeel technical assessment — built with NestJS, PostgreSQL, and JWT authentication.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Reference](#api-reference)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (Node.js) |
| Database | PostgreSQL + TypeORM |
| Auth | Passport + @nestjs/jwt |
| File Uploads | Multer |
| Containerization | Docker & Docker Compose |

---

## Project Structure

```
src/
├── auth/          # JWT auth — controller, service, strategy, guard
├── users/         # Users module
├── orders/        # Orders module — upload, generate, history
├── uploads/       # Upload entity and storage logic
└── common/        # Shared decorators and types
```

Uploaded files are stored in `uploads/` and served statically at `/uploads/<filename>`.

---

## Getting Started

**Requirements:** Node.js 20+, pnpm, Docker (optional but recommended)

```bash
# Install dependencies
pnpm install

# Start with Docker (recommended)
docker-compose up

# Or start manually (requires a running PostgreSQL instance)
pnpm start:dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=tashkeel

JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1d

FRONTEND_API_URL=http://localhost:8080   # Frontend origin for CORS
```

---

## Authentication

This API uses **JWT Bearer tokens**. Include the token in the `Authorization` header for all protected routes:

```
Authorization: Bearer <access_token>
```

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "omar@test.com",
  "password": "123456"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "omar@test.com",
  "password": "123456"
}
```

```json
// Response
{
  "access_token": "JWT_HERE",
  "user": { "id": 1, "email": "omar@test.com" }
}
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Log in and receive a JWT |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload` | ✓ | Upload a manufacturing design file with order metadata |
| POST | `/generate` | ✓ | Create a design request (no file required) |
| GET | `/history` | ✓ | Retrieve the authenticated user's order history |

---

### POST `/upload`

Accepts `multipart/form-data`.

| Field | Required | Description |
|---|---|---|
| `file` | ✓ | Manufacturing design file |
| `title` | | Order title |
| `serviceType` | | Type of service |
| `material` | | Material specification |
| `dimensions` | | Dimensions |
| `quantity` | | Quantity |
| `notes` | | Additional notes |
| `paymentMethod` | | Payment method |

---

### POST `/generate`

Accepts `application/json`.

| Field | Required | Description |
|---|---|---|
| `title` | ✓ | Request title |
| `description` | ✓ | Request description |
| `projectType` | | Type of project |
| `usage` | | Intended usage |
| `dimensions` | | Dimensions |
| `outputOption` | | Output format/option |
| `notes` | | Additional notes |
| `paymentMethod` | | Payment method |