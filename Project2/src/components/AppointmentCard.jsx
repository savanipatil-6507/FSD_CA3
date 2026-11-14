import React from 'react';
import StatusBadge from './StatusBadge';

export default function AppointmentCard({ appointment, onStatusChange, onDelete }) {
  const { id, patientName, patientPhone, department, doctorName, date, time, reason, status } = appointment;

  return (
    <div className="appointment-item">
      <div className="appointment-header">
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{patientName}</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            #{id} • 📞 {patientPhone}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="appointment-meta">
        <div>🏥 <strong>Dept:</strong> {department}</div>
        <div>👨‍⚕️ <strong>Doctor:</strong> {doctorName}</div>
        <div>📅 <strong>Date:</strong> {date}</div>
        <div>⏰ <strong>Time:</strong> {time}</div>
      </div>

      <div style={{ fontSize: '0.88rem', color: '#475569' }}>
        <strong>Symptoms / Reason:</strong> {reason}
      </div>

      <div className="appointment-actions">
        {status !== 'Completed' && (
          <button
            className="btn btn-sm btn-secondary"
            style={{ color: '#16a34a', borderColor: '#16a34a' }}
            onClick={() => onStatusChange(id, 'Completed')}
          >
            ✓ Complete
          </button>
        )}
        {status !== 'Cancelled' && (
          <button
            className="btn btn-sm btn-secondary"
            style={{ color: '#dc2626', borderColor: '#dc2626' }}
            onClick={() => onStatusChange(id, 'Cancelled')}
          >
            ✕ Cancel
          </button>
        )}
        {status === 'Cancelled' && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onStatusChange(id, 'Scheduled')}
          >
            ↺ Re-activate
          </button>
        )}
        <button
          className="btn btn-sm btn-secondary"
          style={{ color: '#94a3b8' }}
          onClick={() => onDelete(id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

