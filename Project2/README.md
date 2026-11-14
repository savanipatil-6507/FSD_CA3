# Project 2: React Hospital Appointment Application

## Overview
A modern, component-driven React application for hospital appointment management built with reusable functional components, JSX, props, state hooks (`useState`, `useEffect`), conditional rendering, event handling, and multi-page routing via **React Router DOM**.

---

## Technical Highlights
- **Functional Components & JSX**: Clean separation into modular UI components (`Navbar`, `AppointmentCard`, `StatsSummary`, `StatusBadge`) and view pages (`DashboardPage`, `AppointmentsPage`, `BookAppointmentPage`).
- **State & Props Management**:
  - `useState`: Handles active appointment records, controlled input form states, search query, status filtering, and sorting criteria.
  - Props drilling with typed/clean callbacks (`onAddAppointment`, `onStatusChange`, `onDelete`).
- **Lifecycle & Persistence with `useEffect`**:
  - Synchronizes appointments to the browser's `localStorage` on any state update so data persists across page reloads.
- **Conditional Rendering**:
  - Dynamically renders status badges with contextual theme colors (`badge-scheduled`, `badge-completed`, `badge-cancelled`).
  - Displays empty state illustrations when no records match filter/search criteria.
  - Toggles available action buttons based on current appointment state.
- **Form Handling & Input Validation**:
  - Controlled inputs for patient name, contact number, department, doctor, date/time, and medical reason.
  - Comprehensive client validation: minimum length, 10-digit mobile number format, date in the future, and mandatory field checks.
- **React Router Navigation**:
  - Route mapping with `BrowserRouter`, `Routes`, `Route`, `NavLink`, and programmatic redirection via `useNavigate`.

---

## Directory Structure
```
Project2/
├── src/
│   ├── components/
│   │   ├── AppointmentCard.jsx   # Appointment record card
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   ├── StatsSummary.jsx      # Dashboard metrics cards
│   │   └── StatusBadge.jsx       # Status pill badge
│   ├── data/
│   │   └── mockData.js           # Initial sample records
│   ├── pages/
│   │   ├── AppointmentsPage.jsx  # Listing view with search & sort
│   │   ├── BookAppointmentPage.jsx # Data-entry booking form
│   │   └── DashboardPage.jsx     # Overview & recent appointments
│   ├── App.jsx                   # Root application state & routes
│   ├── index.css                 # Global styling
│   └── main.jsx                  # Entry point
├── index.html                    # Root HTML file
├── vite.config.js                # Vite build config
├── package.json                  # Dependencies & scripts
└── README.md
```

---

## How to Install and Run
```bash
cd Project2
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

