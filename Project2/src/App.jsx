import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import { initialAppointments } from './data/mockData';

export default function App() {
  // useState hook for appointment records with lazy initialization from localStorage
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('medicare_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing localStorage appointments:', e);
      }
    }
    return initialAppointments;
  });

  // useEffect hook to synchronize state to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('medicare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handler: Add new appointment record
  const handleAddAppointment = (newRecord) => {
    setAppointments(prev => [newRecord, ...prev]);
  };

  // Handler: Update appointment status (Scheduled, Completed, Cancelled)
  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  // Handler: Delete appointment
  const handleDeleteAppointment = (id) => {
    if (window.confirm(`Are you sure you want to delete appointment #${id}?`)) {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="container">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  appointments={appointments}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteAppointment}
                />
              }
            />
            <Route
              path="/appointments"
              element={
                <AppointmentsPage
                  appointments={appointments}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteAppointment}
                />
              }
            />
            <Route
              path="/book"
              element={
                <BookAppointmentPage onAddAppointment={handleAddAppointment} />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

