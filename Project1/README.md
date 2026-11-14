# Project 1: Browser-Based Hospital Appointment Interface

## Overview
A responsive, browser-based hospital appointment management interface built with pure **HTML5, CSS3, and JavaScript**. Demonstrates robust DOM manipulation, event handling, input validation, Fetch API with `async/await`, simulated HTTP request/response methods with JSON, real-time sorting, status updates, and user-friendly error messages.

---

## Features Implemented
1. **DOM Manipulation & Dynamic Rendering**:
   - Dynamic creation, updating, and removal of appointment card elements.
   - Live metrics summary ribbon showing total, scheduled, completed, and cancelled counts.
2. **Event Handling & User Input Validation**:
   - Form submission handler capturing patient details.
   - Field-level validation: checks required fields, 10-digit phone format, non-past date selection, and symptom description length.
   - Inline visual feedback with custom error indicators.
3. **Fetch API & async/await**:
   - Loads initial sample records asynchronously from `./appointments.json` using `fetch()` and `async/await`.
   - Comprehensive `try...catch` error handling with fallback states.
4. **Demonstration of HTTP Methods & JSON Data**:
   - `GET`: Retrieves appointment records in JSON format.
   - `POST`: Simulates dispatching new appointment payload (`JSON.stringify`) and receiving confirmation with assigned IDs.
   - `PUT`: Updates appointment status (`Scheduled` ➔ `Completed` / `Cancelled`).
   - `DELETE`: Removes appointment records.
5. **Sorting & Filtering**:
   - Sort by Date (Earliest / Latest), Patient Name (A-Z / Z-A), and Status.
   - Search filter by patient name, doctor, or department.
   - Filter dropdown by appointment status (`Scheduled`, `Completed`, `Cancelled`, or `All`).
6. **Toast Notifications**:
   - Floating contextual notifications for success, informative updates, and error alerts.

---

## Folder Structure
```
Project1/
├── index.html          # Semantic HTML5 layout
├── style.css           # Modern, responsive healthcare theme
├── app.js              # State management, DOM events, Fetch API service
├── appointments.json   # Sample initial dataset
└── README.md           # Documentation
```

---

## How to Run
1. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Alternatively, serve via any lightweight static server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Open `http://localhost:8000/Project1/` in your browser.

