import React, { useState, useEffect } from 'react';
import { api } from './api';

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Booking Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    department: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load appointments from backend API
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAppointments(statusFilter, searchKeyword);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAppointments();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.patientName || !formData.patientPhone || !formData.department ||
        !formData.doctorName || !formData.appointmentDate || !formData.appointmentTime || !formData.reason) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      const created = await api.createAppointment(formData);
      setSuccessMsg(`Appointment #${created.appointmentNumber} created and saved to database!`);
      setFormData({
        patientName: '',
        patientPhone: '',
        department: '',
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: ''
      });
      loadAppointments();
    } catch (err) {
      setError(err.message || 'Error creating appointment');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Status update handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateStatus(id, newStatus);
      setSuccessMsg(`Status updated to ${newStatus}`);
      loadAppointments();
    } catch (err) {
      setError(err.message || 'Error updating status');
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm(`Delete appointment record #${id}?`)) return;
    try {
      await api.deleteAppointment(id);
      setSuccessMsg(`Record #${id} deleted.`);
      loadAppointments();
    } catch (err) {
      setError(err.message || 'Error deleting record');
    }
  };

  return (
    <div>
      <header>
        <div className="container header-content">
          <div className="brand">
            <span style={{ fontSize: '1.8rem' }}>🏥</span>
            <div>
              <h1>MediCare Integrated System</h1>
              <p>Fullstack React + Express + Sequelize Database Integration</p>
            </div>
          </div>
          <div>
            <span className="badge-backend">Backend: Express.js + DB</span>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="alert alert-danger">
            ⚠️ <strong>Error:</strong> {error}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            ✅ {successMsg}
          </div>
        )}

        <div className="grid">
          {/* Left Column: Booking Form */}
          <section className="card">
            <h2 className="card-title">Book New Appointment</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Patient Full Name *</label>
                <input
                  type="text"
                  name="patientName"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Phone (10 digits) *</label>
                <input
                  type="tel"
                  name="patientPhone"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Department --</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>

              <div className="form-group">
                <label>Attending Doctor *</label>
                <input
                  type="text"
                  name="doctorName"
                  className="form-control"
                  placeholder="e.g. Dr. House"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    className="form-control"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    className="form-control"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Symptoms *</label>
                <textarea
                  name="reason"
                  rows="3"
                  className="form-control"
                  placeholder="Brief reason for consultation..."
                  value={formData.reason}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                {formSubmitting ? 'Saving to Database...' : 'Persist Appointment'}
              </button>
            </form>
          </section>

          {/* Right Column: Listing View & Search */}
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                Appointments Database Records
              </h2>
              <button
                className="btn btn-sm"
                style={{ background: '#e2e8f0' }}
                onClick={loadAppointments}
              >
                🔄 Refresh
              </button>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search name or doctor..."
                  className="form-control"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-primary" style={{ width: 'auto' }}>
                  Search
                </button>
              </form>

              <select
                className="form-control"
                style={{ width: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                Connecting to backend database...
              </p>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>No appointment records found in database.</p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>
                  Persisted records in DB: {appointments.length}
                </p>
                {appointments.map(apt => (
                  <div key={apt.id} className="appointment-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div>
                        <strong>{apt.patientName}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '8px' }}>
                          #{apt.appointmentNumber || apt.id} • 📞 {apt.patientPhone}
                        </span>
                      </div>
                      <span className={`badge badge-${(apt.status || 'scheduled').toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>
                      🏥 {apt.department} &bull; 👨‍⚕️ {apt.doctorName} &bull; 📅 {apt.appointmentDate} at {apt.appointmentTime}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>
                      <em>"{apt.reason}"</em>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {apt.status !== 'Completed' && (
                        <button
                          className="btn btn-sm"
                          style={{ background: '#dcfce7', color: '#16a34a' }}
                          onClick={() => handleStatusChange(apt.id, 'Completed')}
                        >
                          ✓ Complete
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          className="btn btn-sm"
                          style={{ background: '#fee2e2', color: '#dc2626' }}
                          onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                        >
                          ✕ Cancel
                        </button>
                      )}
                      <button
                        className="btn btn-sm"
                        style={{ background: '#f1f5f9', color: '#64748b' }}
                        onClick={() => handleDelete(apt.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

