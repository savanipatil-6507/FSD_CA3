# Project 5: Integrated Fullstack Hospital Appointment System

## Overview
An end-to-end fullstack hospital appointment system integrating a **React frontend** with an **Express.js backend** and database persistence using **PostgreSQL with Sequelize** (with automatic SQLite fallback for local development). Features dynamic CORS configuration, environment variable management, and production-ready deployment blueprints for **Vercel** (frontend) and **Render** (backend).

---

## 1. Database Schema & Models

### Sequelize Model Definition (`backend/models/Appointment.js`)
Persists appointments with PostgreSQL (on Render) or SQLite (locally):

```javascript
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointmentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  patientPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointmentDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  appointmentTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled'
  }
}, {
  timestamps: true,
  tableName: 'appointments'
});
```

### Alternative MongoDB Mongoose Schema (Reference)
```javascript
const appointmentMongooseSchema = new mongoose.Schema({
  appointmentNumber: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  department: { type: String, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });
```

---

## 2. API Endpoints Reference

| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET` | `/api/appointments` | Retrieve records from database | Optional `?status=Scheduled` & `?search=query` |
| `GET` | `/api/appointments/:id` | Retrieve single record by primary key | URL parameter `id` |
| `POST` | `/api/appointments` | Validate & persist new appointment | JSON payload with patient & visit details |
| `PUT` | `/api/appointments/:id` | Update appointment details or status | JSON `{ status: "Completed" }` |
| `DELETE` | `/api/appointments/:id` | Delete record from database | URL parameter `id` |

---

## 3. Environment Variables Configuration

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgres://<user>:<password>@<host>/<database>
CLIENT_ORIGIN=https://your-frontend.vercel.app
```
*(No passwords or secret keys are committed. Values are configured via Render environment dashboard).*

### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 4. Deployment Instructions

### A. Deploy Backend on Render
1. Push the repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), create a new **Web Service** or use **Blueprints** with `render.yaml`.
3. Set the following build and start commands:
   - **Root Directory**: `Project5/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Attach a free **Render PostgreSQL** database and configure the environment variable:
   - `DATABASE_URL`: Connection string provided by Render PostgreSQL.
   - `CLIENT_ORIGIN`: Your Vercel frontend URL.

### B. Deploy Frontend on Vercel
1. In the [Vercel Dashboard](https://vercel.com), import the Git repository.
2. Select `Project5/frontend` as the **Root Directory**.
3. Framework Preset: **Vite**.
4. Configure Environment Variables in Vercel:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-url>/api`
5. Vercel utilizes `vercel.json` to handle client-side routing rewrites.

---

## 5. Running Locally

### Step 1: Start Backend Server
```bash
cd Project5/backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` with automatic SQLite persistence.*

### Step 2: Start Frontend App
```bash
cd Project5/frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` connected to the local backend API.*

