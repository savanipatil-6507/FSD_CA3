import React from 'react';

export default function StatsSummary({ appointments }) {
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  return (
    <div className="stats-grid">
      <div className="stat-box">
        <div className="stat-icon">📅</div>
        <div className="stat-info">
          <h3>{total}</h3>
          <p>Total Appointments</p>
        </div>
      </div>
      <div className="stat-box">
        <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>⏳</div>
        <div className="stat-info">
          <h3>{scheduled}</h3>
          <p>Scheduled</p>
        </div>
      </div>
      <div className="stat-box">
        <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>✅</div>
        <div className="stat-info">
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>
      </div>
      <div className="stat-box">
        <div className="stat-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>❌</div>
        <div className="stat-info">
          <h3>{cancelled}</h3>
          <p>Cancelled</p>
        </div>
      </div>
    </div>
  );
}

