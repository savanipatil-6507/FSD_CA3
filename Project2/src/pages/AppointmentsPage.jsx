import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

export default function AppointmentsPage({ appointments, onStatusChange, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-asc');

  // Filter appointments
  const filtered = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      apt.patientName.toLowerCase().includes(q) ||
      apt.doctorName.toLowerCase().includes(q) ||
      apt.department.toLowerCase().includes(q) ||
      apt.id.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Sort appointments
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`);
    }
    if (sortBy === 'date-desc') {
      return new Date(`${b.date}T${b.time || '00:00'}`) - new Date(`${a.date}T${a.time || '00:00'}`);
    }
    if (sortBy === 'name-asc') {
      return a.patientName.localeCompare(b.patientName);
    }
    if (sortBy === 'name-desc') {
      return b.patientName.localeCompare(a.patientName);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Appointment Records</h1>
          <p>Browse, filter, sort, and manage patient appointments</p>
        </div>
        <Link to="/book" className="btn btn-primary">
          + Book New Appointment
        </Link>
      </div>

      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search patient, doctor or dept..."
              className="form-control"
              style={{ maxWidth: '320px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Sort:</span>
            <select
              className="form-control"
              style={{ width: '200px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="name-asc">Patient Name (A-Z)</option>
              <option value="name-desc">Patient Name (Z-A)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
          <h3>No matching appointments found</h3>
          <p>Try adjusting your search criteria or booking a new appointment.</p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
            Showing {sorted.length} of {appointments.length} appointments
          </p>
          {sorted.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

