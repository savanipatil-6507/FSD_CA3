import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function BookAppointmentPage({ onAddAppointment }) {
  const navigate = useNavigate();

  // Form State using useState
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    department: '',
    doctorName: '',
    date: '',
    time: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controlled change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient full name is required.';
    } else if (formData.patientName.trim().length < 3) {
      newErrors.patientName = 'Name must be at least 3 characters long.';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.patientPhone.trim())) {
      newErrors.patientPhone = 'Enter a valid 10-digit mobile number.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a hospital department.';
    }

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Attending doctor name is required.';
    }

    if (!formData.date) {
      newErrors.date = 'Appointment date is required.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.date);
      if (selected < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time slot is required.';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide the medical reason/symptoms.';
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = 'Reason must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const newAppointment = {
      ...formData,
      id: 'APT-' + Math.floor(100 + Math.random() * 900),
      status: 'Scheduled'
    };

    // Pass data back to parent component state via props
    onAddAppointment(newAppointment);

    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to appointments listing view
      navigate('/appointments');
    }, 400);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>Book Doctor's Appointment</h1>
          <p>Fill out the form below to schedule a new patient consultation</p>
        </div>
        <Link to="/appointments" className="btn btn-secondary">
          &larr; Back to List
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="patientName">Patient Full Name *</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                className="form-control"
                placeholder="e.g. John Doe"
                value={formData.patientName}
                onChange={handleChange}
              />
              {errors.patientName && <span className="error-text">{errors.patientName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="patientPhone">Contact Phone Number *</label>
              <input
                type="tel"
                id="patientPhone"
                name="patientPhone"
                className="form-control"
                placeholder="10-digit mobile number"
                value={formData.patientPhone}
                onChange={handleChange}
              />
              {errors.patientPhone && <span className="error-text">{errors.patientPhone}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">-- Choose Department --</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="doctorName">Doctor Name *</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                className="form-control"
                placeholder="e.g. Dr. Sarah Jenkins"
                value={formData.doctorName}
                onChange={handleChange}
              />
              {errors.doctorName && <span className="error-text">{errors.doctorName}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="date">Appointment Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                min={todayStr}
                className="form-control"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Appointment Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && <span className="error-text">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Symptoms / Medical Reason *</label>
            <textarea
              id="reason"
              name="reason"
              rows="3"
              className="form-control"
              placeholder="Describe primary complaints or symptoms..."
              value={formData.reason}
              onChange={handleChange}
            />
            {errors.reason && <span className="error-text">{errors.reason}</span>}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Link to="/appointments" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Appointment...' : 'Submit Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

