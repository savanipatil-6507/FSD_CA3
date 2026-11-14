/**
 * City Care Hospital - Appointment Management
 * Vanilla JavaScript demonstrating DOM manipulation, Event Handling,
 * Fetch API with async/await, Sorting, Status Updates, and Error Handling.
 */

// Application State
let appointments = [];
let currentFilter = 'ALL';
let currentSearch = '';
let currentSort = 'date-asc';

// DOM Element References
const form = document.getElementById('appointment-form');
const listContainer = document.getElementById('appointment-list');
const refreshBtn = document.getElementById('refresh-btn');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const sortBy = document.getElementById('sort-by');
const recordCount = document.getElementById('record-count');
const toastContainer = document.getElementById('toast-container');

// Form Field References
const fields = {
  patientName: document.getElementById('patientName'),
  patientPhone: document.getElementById('patientPhone'),
  department: document.getElementById('department'),
  doctorName: document.getElementById('doctorName'),
  appointmentDate: document.getElementById('appointmentDate'),
  appointmentTime: document.getElementById('appointmentTime'),
  reason: document.getElementById('reason')
};

// ==========================================
// 1. Simulated HTTP / API Service Layer
// Demonstrates HTTP Methods (GET, POST, PUT, DELETE) and JSON Payloads
// ==========================================
const apiService = {
  /**
   * GET Request: Fetch sample appointment records using Fetch API and async/await
   */
  async fetchAppointments() {
    try {
      const response = await fetch('./appointments.json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch records (Status: ${response.status} ${response.statusText})`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Fetch API Error:', error);
      return {
        success: false,
        message: error.message || 'Network error while fetching appointment records.'
      };
    }
  },

  /**
   * POST Request Simulation: Sends new appointment JSON payload
   */
  async createAppointment(newAppointment) {
    try {
      // Simulate asynchronous network roundtrip
      await new Promise(resolve => setTimeout(resolve, 300));

      const payload = JSON.stringify(newAppointment);
      console.log('HTTP POST /api/appointments Payload:', payload);

      // Validate required server-side fields
      if (!newAppointment.patientName || !newAppointment.appointmentDate) {
        throw new Error('400 Bad Request: Incomplete appointment details.');
      }

      return {
        success: true,
        statusCode: 201,
        data: {
          ...newAppointment,
          id: 'APT-' + Math.floor(100 + Math.random() * 900)
        }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * PUT Request Simulation: Updates appointment status
   */
  async updateStatus(id, newStatus) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log(`HTTP PUT /api/appointments/${id}/status`, JSON.stringify({ status: newStatus }));

      const target = appointments.find(a => a.id === id);
      if (!target) {
        throw new Error(`404 Not Found: Appointment ${id} does not exist.`);
      }

      return {
        success: true,
        statusCode: 200,
        data: { id, status: newStatus }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * DELETE Request Simulation: Removes appointment
   */
  async deleteAppointment(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`HTTP DELETE /api/appointments/${id}`);

      return {
        success: true,
        statusCode: 200,
        message: `Appointment ${id} successfully deleted.`
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// ==========================================
// 2. Data Initialization & Fetch
// ==========================================
async function loadInitialData() {
  listContainer.innerHTML = '<div class="loading-spinner">Fetching appointments from server...</div>';

  const result = await apiService.fetchAppointments();

  if (result.success && Array.isArray(result.data)) {
    appointments = result.data;
    showToast('Sample appointment records loaded successfully.', 'info');
    renderAppointments();
    updateStats();
  } else {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Failed to load appointments</h3>
        <p>${result.message}</p>
        <button class="btn btn-secondary btn-sm" onclick="loadInitialData()" style="margin-top: 12px;">Retry</button>
      </div>
    `;
    showToast(result.message, 'error');
  }
}

// ==========================================
// 3. Input Validation & Error Handling
// ==========================================
function clearValidationErrors() {
  Object.keys(fields).forEach(key => {
    const errorEl = document.getElementById(`error-${key}`);
    if (errorEl) errorEl.textContent = '';
    fields[key].style.borderColor = '';
  });
}

function setFieldError(fieldKey, message) {
  const errorEl = document.getElementById(`error-${fieldKey}`);
  if (errorEl) errorEl.textContent = message;
  if (fields[fieldKey]) fields[fieldKey].style.borderColor = 'var(--danger)';
}

function validateForm(data) {
  clearValidationErrors();
  let isValid = true;

  // Name validation
  if (!data.patientName || data.patientName.trim().length < 3) {
    setFieldError('patientName', 'Full name is required (minimum 3 characters).');
    isValid = false;
  }

  // Phone validation (10 digits)
  const phonePattern = /^[6-9]\d{9}$/;
  if (!data.patientPhone || !phonePattern.test(data.patientPhone.trim())) {
    setFieldError('patientPhone', 'Please enter a valid 10-digit phone number.');
    isValid = false;
  }

  // Department validation
  if (!data.department) {
    setFieldError('department', 'Please select a medical department.');
    isValid = false;
  }

  // Doctor validation
  if (!data.doctorName || data.doctorName.trim().length < 3) {
    setFieldError('doctorName', 'Attending physician name is required.');
    isValid = false;
  }

  // Date validation (must not be in the past)
  if (!data.appointmentDate) {
    setFieldError('appointmentDate', 'Appointment date is required.');
    isValid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.appointmentDate);
    if (selectedDate < today) {
      setFieldError('appointmentDate', 'Appointment date cannot be in the past.');
      isValid = false;
    }
  }

  // Time validation
  if (!data.appointmentTime) {
    setFieldError('appointmentTime', 'Time slot is required.');
    isValid = false;
  }

  // Reason validation
  if (!data.reason || data.reason.trim().length < 5) {
    setFieldError('reason', 'Please describe symptoms/reason (at least 5 characters).');
    isValid = false;
  }

  return isValid;
}

// ==========================================
// 4. Form Event Handling
// ==========================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    patientName: fields.patientName.value.trim(),
    patientPhone: fields.patientPhone.value.trim(),
    department: fields.department.value,
    doctorName: fields.doctorName.value.trim(),
    appointmentDate: fields.appointmentDate.value,
    appointmentTime: fields.appointmentTime.value,
    reason: fields.reason.value.trim(),
    status: 'Scheduled'
  };

  if (!validateForm(formData)) {
    showToast('Please fix the highlighted validation errors.', 'error');
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';

  // Async call simulating POST
  const response = await apiService.createAppointment(formData);

  submitBtn.disabled = false;
  submitBtn.textContent = 'Confirm & Book Appointment';

  if (response.success) {
    appointments.unshift(response.data);
    form.reset();
    clearValidationErrors();
    showToast(`Appointment ${response.data.id} confirmed for ${response.data.patientName}!`, 'success');
    renderAppointments();
    updateStats();
  } else {
    showToast(response.message, 'error');
  }
});

// ==========================================
// 5. Status Updates & Actions (PUT, DELETE)
// ==========================================
async function updateAppointmentStatus(id, newStatus) {
  const result = await apiService.updateStatus(id, newStatus);
  if (result.success) {
    const apt = appointments.find(a => a.id === id);
    if (apt) apt.status = newStatus;
    showToast(`Status updated to ${newStatus} for #${id}`, 'success');
    renderAppointments();
    updateStats();
  } else {
    showToast(result.message, 'error');
  }
}

async function deleteAppointmentRecord(id) {
  if (!confirm(`Are you sure you want to cancel and remove appointment #${id}?`)) {
    return;
  }

  const result = await apiService.deleteAppointment(id);
  if (result.success) {
    appointments = appointments.filter(a => a.id !== id);
    showToast(result.message, 'info');
    renderAppointments();
    updateStats();
  } else {
    showToast(result.message, 'error');
  }
}

// ==========================================
// 6. Sorting & Filtering
// ==========================================
function getProcessedAppointments() {
  let list = [...appointments];

  // Filter by Status
  if (currentFilter !== 'ALL') {
    list = list.filter(a => a.status === currentFilter);
  }

  // Filter by Search Query (Patient Name, Doctor Name, or Dept)
  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase();
    list = list.filter(a =>
      a.patientName.toLowerCase().includes(q) ||
      a.doctorName.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  }

  // Sorting
  list.sort((a, b) => {
    switch (currentSort) {
      case 'date-asc':
        return new Date(`${a.appointmentDate}T${a.appointmentTime || '00:00'}`) -
               new Date(`${b.appointmentDate}T${b.appointmentTime || '00:00'}`);
      case 'date-desc':
        return new Date(`${b.appointmentDate}T${b.appointmentTime || '00:00'}`) -
               new Date(`${a.appointmentDate}T${a.appointmentTime || '00:00'}`);
      case 'name-asc':
        return a.patientName.localeCompare(b.patientName);
      case 'name-desc':
        return b.patientName.localeCompare(a.patientName);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return list;
}

// Event Listeners for Filters & Sorting
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  renderAppointments();
});

filterStatus.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  renderAppointments();
});

sortBy.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderAppointments();
});

refreshBtn.addEventListener('click', () => {
  loadInitialData();
});

// ==========================================
// 7. DOM Rendering & UI Updates
// ==========================================
function renderAppointments() {
  const filteredList = getProcessedAppointments();
  recordCount.textContent = `Showing ${filteredList.length} of ${appointments.length} records`;

  if (filteredList.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3>No Appointments Found</h3>
        <p>No appointments match the current filter or search criteria.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filteredList.map(apt => {
    const statusClass = `badge-${apt.status.toLowerCase()}`;
    return `
      <article class="appointment-item" data-id="${apt.id}">
        <div class="appointment-item-header">
          <div class="patient-info">
            <h4>${escapeHtml(apt.patientName)}</h4>
            <span class="apt-id">#${apt.id} • 📞 ${escapeHtml(apt.patientPhone || 'N/A')}</span>
          </div>
          <span class="badge ${statusClass}">${apt.status}</span>
        </div>

        <div class="appointment-details">
          <div class="detail-line">
            <span>🏥</span>
            <span><strong>Dept:</strong> ${escapeHtml(apt.department)}</span>
          </div>
          <div class="detail-line">
            <span>👨‍⚕️</span>
            <span><strong>Doctor:</strong> ${escapeHtml(apt.doctorName)}</span>
          </div>
          <div class="detail-line">
            <span>📅</span>
            <span><strong>Date:</strong> ${apt.appointmentDate}</span>
          </div>
          <div class="detail-line">
            <span>⏰</span>
            <span><strong>Time:</strong> ${apt.appointmentTime}</span>
          </div>
        </div>

        <div class="appointment-reason">
          <strong>Reason:</strong> ${escapeHtml(apt.reason)}
        </div>

        <div class="appointment-actions">
          ${apt.status !== 'Completed' ? `
            <button class="btn-status complete" onclick="updateAppointmentStatus('${apt.id}', 'Completed')">
              ✓ Mark Completed
            </button>
          ` : ''}
          ${apt.status !== 'Cancelled' ? `
            <button class="btn-status cancel" onclick="updateAppointmentStatus('${apt.id}', 'Cancelled')">
              ✕ Cancel
            </button>
          ` : ''}
          ${apt.status === 'Cancelled' ? `
            <button class="btn-status" onclick="updateAppointmentStatus('${apt.id}', 'Scheduled')">
              ↺ Re-Schedule
            </button>
          ` : ''}
          <button class="btn-delete" title="Delete record" onclick="deleteAppointmentRecord('${apt.id}')">
            🗑 Delete
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function updateStats() {
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-scheduled').textContent = scheduled;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-cancelled').textContent = cancelled;
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `
    <span>${icon}</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Expose handlers to global window for inline onclicks
window.updateAppointmentStatus = updateAppointmentStatus;
window.deleteAppointmentRecord = deleteAppointmentRecord;
window.loadInitialData = loadInitialData;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set default min date for date input to today
  const today = new Date().toISOString().split('T')[0];
  fields.appointmentDate.setAttribute('min', today);

  loadInitialData();
});

