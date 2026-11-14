import React from 'react';
import { Link } from 'react-router-dom';
import StatsSummary from '../components/StatsSummary';
import AppointmentCard from '../components/AppointmentCard';

export default function DashboardPage({ appointments, onStatusChange, onDelete }) {
  const recentAppointments = appointments.slice(0, 3);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hospital Appointment Dashboard</h1>
          <p>Real-time overview of clinic scheduling and patient visits</p>
        </div>
        <Link to="/book" className="btn btn-primary">
          + Book New Appointment
        </Link>
      </div>

      <StatsSummary appointments={appointments} />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Recent Appointments</h2>
          <Link to="/appointments" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            View All ({appointments.length}) &rarr;
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
            <p>No appointments recorded yet.</p>
            <Link to="/book" className="btn btn-primary" style={{ marginTop: '12px' }}>
              Create First Appointment
            </Link>
          </div>
        ) : (
          recentAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

