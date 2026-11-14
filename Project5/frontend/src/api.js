/**
 * Frontend API Service
 * Connects React UI to the Express.js Backend via Fetch API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  /**
   * Fetch all appointment records
   */
  async getAppointments(status = 'ALL', search = '') {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (search) params.append('search', search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/appointments${queryStr}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch records: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data || [];
  },

  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData) {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to create appointment');
    }
    return data.data;
  },

  /**
   * Update appointment status
   */
  async updateStatus(id, newStatus) {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to update appointment');
    }
    return data.data;
  },

  /**
   * Delete an appointment
   */
  async deleteAppointment(id) {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to delete appointment');
    }
    return true;
  }
};

