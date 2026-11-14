# Project 4: Express.js Hospital Appointment REST API

## Overview
A production-ready **Express.js REST API** for hospital appointments featuring full CRUD operations, request logging middleware, input validation middleware, centralized error handling, and secure protected routes using **JWT (JSON Web Tokens)** and **bcrypt** password hashing.

---

## Technical Highlights
1. **CRUD Operations**:
   - `GET /api/appointments`: List all appointments with filtering (`?status=`, `?search=`).
   - `GET /api/appointments/:id`: Retrieve details for an individual appointment.
   - `POST /api/appointments`: Schedule an appointment with validation.
   - `PUT /api/appointments/:id`: Update details or status (`Scheduled`, `Completed`, `Cancelled`).
   - `DELETE /api/appointments/:id`: Protected deletion of records.
2. **Middleware**:
   - **Request Logging Middleware** (`middleware/logger.js`): Logs timestamp, HTTP method, URL, status code, and latency for every request.
   - **Input Validation Middleware** (`middleware/validateAppointment.js`): Inspects incoming payloads and returns HTTP 400 Bad Request with field-level details.
   - **Centralized Error Handling** (`middleware/errorHandler.js`): Intercepts all runtime exceptions and formats standardized JSON error responses.
3. **Authentication & Protected Routes**:
   - `POST /api/auth/register`: Hashes passwords using **bcrypt** (salt rounds = 10).
   - `POST /api/auth/login`: Validates credentials against hashed passwords and signs a **JWT token**.
   - `middleware/auth.js`: Verifies `Bearer <token>` in `Authorization` header.
   - Protected endpoints: `DELETE /api/appointments/:id` and `GET /api/appointments/admin/stats`.

---

## API Endpoints Reference

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and overview |
| `POST` | `/api/auth/register` | Register staff/user with bcrypt hashed password |
| `POST` | `/api/auth/login` | Login and obtain signed JWT token |
| `GET` | `/api/appointments` | Fetch all appointments |
| `GET` | `/api/appointments/:id` | Fetch appointment by ID |
| `POST` | `/api/appointments` | Create appointment (validated via middleware) |
| `PUT` | `/api/appointments/:id` | Update appointment (validated via middleware) |

### Protected Endpoints (Requires `Authorization: Bearer <JWT_TOKEN>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/appointments/admin/stats` | Hospital appointment analytics & metrics |
| `DELETE` | `/api/appointments/:id` | Delete appointment record |

---

## Installation & Running

### Install Dependencies
```bash
cd Project4
npm install
```

### Start Server
```bash
npm start
```
Server runs on `http://localhost:5000`.

### Run Automated Integration Tests
```bash
npm test
```
The test script automatically tests registration, login, JWT verification, CRUD routes, validation rejection, protected route security, and centralized error handling.

