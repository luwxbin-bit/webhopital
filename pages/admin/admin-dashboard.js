/**
 * Admin Dashboard JavaScript
 * Xử lý logic cho trang admin dashboard
 */

// Global variables
let currentTab = 'dashboard';
let currentEditingDoctor = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check admin access
    if (!AdminModule.protectAdminPage()) return;

    // Initialize dashboard
    initializeDashboard();
    loadDashboardStats();
    setupEventListeners();

    // Load initial data
    loadDoctors();
    loadAppointments();
    loadUsers();
});

// Initialize dashboard
function initializeDashboard() {
    const user = AuthModule.getCurrentUser();
    document.getElementById('userName').textContent = user.name || 'Admin';
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        AuthModule.logout();
        window.location.href = '../login.html';
    });

    // Add doctor button
    document.getElementById('addDoctorBtn').addEventListener('click', function() {
        openAddDoctorModal();
    });

    // Doctor form
    document.getElementById('doctorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDoctor();
    });

    // Appointment status filter
    document.getElementById('appointmentStatusFilter').addEventListener('change', function() {
        loadAppointments(this.value);
    });

    // Reset system
    document.getElementById('resetSystemBtn').addEventListener('click', function() {
        if (AdminModule.resetSystem()) {
            location.reload();
        }
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
}

// Switch tabs
function switchTab(tabName) {
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    currentTab = tabName;

    // Load tab-specific data
    switch(tabName) {
        case 'doctors':
            loadDoctors();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// Load dashboard statistics
function loadDashboardStats() {
    const stats = AdminModule.getSystemStats();

    if (!stats) return;

    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalDoctors').textContent = stats.totalDoctors;
    document.getElementById('totalAppointments').textContent = stats.totalAppointments;
    document.getElementById('totalRevenue').textContent = formatCurrency(stats.revenue);

    // Create charts
    createAppointmentStatusChart(stats);
    createMonthlyAppointmentsChart();
}

// Create appointment status chart
function createAppointmentStatusChart(stats) {
    const ctx = document.getElementById('appointmentStatusChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'],
            datasets: [{
                data: [
                    stats.pendingAppointments,
                    stats.confirmedAppointments,
                    stats.completedAppointments,
                    stats.cancelledAppointments
                ],
                backgroundColor: [
                    '#ffc107', // warning
                    '#007bff', // primary
                    '#28a745', // success
                    '#dc3545'  // danger
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create monthly appointments chart
function createMonthlyAppointmentsChart() {
    const ctx = document.getElementById('monthlyAppointmentsChart');
    if (!ctx) return;

    // Mock data for last 6 months
    const months = ['Tháng 10', 'Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3'];
    const data = [45, 52, 38, 61, 55, 67];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Số lịch hẹn',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load doctors
function loadDoctors() {
    const tbody = document.getElementById('doctorsTableBody');
    if (!tbody) return;

    // Combine demo doctors and custom doctors
    const customDoctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');
    const allDoctors = [...DEMO_DOCTORS, ...customDoctors];

    tbody.innerHTML = allDoctors.map(doctor => `
        <tr>
            <td>${doctor.id}</td>
            <td><img src="../images/avatar-placeholder.png" alt="${doctor.name}" class="avatar-sm"></td>
            <td>${doctor.name}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.hospital}</td>
            <td>${doctor.experience}</td>
            <td><span class="rating">⭐ ${doctor.rating}</span></td>
            <td><span class="badge badge-success">${doctor.status || 'active'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editDoctor(${doctor.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${doctor.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load appointments
function loadAppointments(statusFilter = '') {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    let appointments = AdminModule.getAllAppointments();

    // Apply filter
    if (statusFilter) {
        appointments = appointments.filter(apt => apt.status === statusFilter);
    }

    tbody.innerHTML = appointments.map(apt => `
        <tr>
            <td>${apt.id}</td>
            <td>${apt.patient ? apt.patient.name : 'N/A'}</td>
            <td>${apt.doctor ? apt.doctor.name : 'N/A'}</td>
            <td>${formatDate(apt.date)}</td>
            <td>${apt.time}</td>
            <td>${apt.symptoms || 'N/A'}</td>
            <td><span class="badge badge-${getStatusClass(apt.status)}">${getStatusText(apt.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewAppointment(${apt.id})">
                    <i class="fas fa-eye"></i>
                </button>
                ${apt.status === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="confirmAppointment(${apt.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${apt.id})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Load users
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const users = AdminModule.getAllUsers();

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="badge badge-${user.role === 'admin' ? 'primary' : 'secondary'}">${getRoleText(user.role)}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Open add doctor modal
function openAddDoctorModal() {
    currentEditingDoctor = null;
    document.getElementById('doctorModalTitle').textContent = 'Thêm bác sĩ';
    document.getElementById('doctorForm').reset();

    // Populate specialty dropdown
    const specialtySelect = document.getElementById('doctorSpecialty');
    specialtySelect.innerHTML = '<option value="">Chọn chuyên khoa</option>' +
        CONSTANTS.SPECIALTIES.map(specialty => `<option value="${specialty}">${specialty}</option>`).join('');

    document.getElementById('doctorModal').style.display = 'block';
}

// Edit doctor
function editDoctor(doctorId) {
    const customDoctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');
    const doctor = customDoctors.find(d => d.id === doctorId) || DEMO_DOCTORS.find(d => d.id === doctorId);

    if (!doctor) return;

    currentEditingDoctor = doctor;
    document.getElementById('doctorModalTitle').textContent = 'Chỉnh sửa bác sĩ';

    // Populate form
    document.getElementById('doctorName').value = doctor.name;
    document.getElementById('doctorSpecialty').value = doctor.specialty;
    document.getElementById('doctorHospital').value = doctor.hospital;
    document.getElementById('doctorExperience').value = doctor.experience;
    document.getElementById('doctorRating').value = doctor.rating;

    // Populate specialty dropdown
    const specialtySelect = document.getElementById('doctorSpecialty');
    specialtySelect.innerHTML = '<option value="">Chọn chuyên khoa</option>' +
        CONSTANTS.SPECIALTIES.map(specialty => `<option value="${specialty}">${specialty}</option>`).join('');

    document.getElementById('doctorModal').style.display = 'block';
}

// Save doctor
function saveDoctor() {
    const formData = {
        name: document.getElementById('doctorName').value,
        specialty: document.getElementById('doctorSpecialty').value,
        hospital: document.getElementById('doctorHospital').value,
        experience: document.getElementById('doctorExperience').value,
        rating: parseFloat(document.getElementById('doctorRating').value)
    };

    if (currentEditingDoctor) {
        AdminModule.updateDoctor(currentEditingDoctor.id, formData);
    } else {
        AdminModule.addDoctor(formData);
    }

    closeModal('doctorModal');
    loadDoctors();
    loadDashboardStats();
}

// Delete doctor
function deleteDoctor(doctorId) {
    if (confirm('Bạn có chắc muốn xóa bác sĩ này? Tất cả lịch hẹn liên quan sẽ bị hủy.')) {
        AdminModule.deleteDoctor(doctorId);
        loadDoctors();
        loadAppointments();
        loadDashboardStats();
    }
}

// View appointment
function viewAppointment(appointmentId) {
    const appointments = AdminModule.getAllAppointments();
    const appointment = appointments.find(a => a.id === appointmentId);

    if (!appointment) return;

    const details = document.getElementById('appointmentDetails');
    details.innerHTML = `
        <div class="appointment-detail">
            <div class="detail-row">
                <strong>ID:</strong> ${appointment.id}
            </div>
            <div class="detail-row">
                <strong>Bệnh nhân:</strong> ${appointment.patient ? appointment.patient.name : 'N/A'}
            </div>
            <div class="detail-row">
                <strong>Bác sĩ:</strong> ${appointment.doctor ? appointment.doctor.name : 'N/A'}
            </div>
            <div class="detail-row">
                <strong>Ngày:</strong> ${formatDate(appointment.date)}
            </div>
            <div class="detail-row">
                <strong>Giờ:</strong> ${appointment.time}
            </div>
            <div class="detail-row">
                <strong>Triệu chứng:</strong> ${appointment.symptoms || 'N/A'}
            </div>
            <div class="detail-row">
                <strong>SĐT:</strong> ${appointment.phone || 'N/A'}
            </div>
            <div class="detail-row">
                <strong>Email:</strong> ${appointment.email || 'N/A'}
            </div>
            <div class="detail-row">
                <strong>Trạng thái:</strong> <span class="badge badge-${getStatusClass(appointment.status)}">${getStatusText(appointment.status)}</span>
            </div>
            <div class="detail-row">
                <strong>Ngày tạo:</strong> ${formatDate(appointment.createdAt)}
            </div>
        </div>
    `;

    document.getElementById('appointmentModal').style.display = 'block';
}

// Confirm appointment
function confirmAppointment(appointmentId) {
    AdminModule.updateAppointmentStatus(appointmentId, CONSTANTS.APPOINTMENT_STATUS.CONFIRMED);
    loadAppointments();
    loadDashboardStats();
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    const reason = prompt('Lý do hủy lịch hẹn:');
    if (reason !== null) {
        AdminModule.updateAppointmentStatus(appointmentId, CONSTANTS.APPOINTMENT_STATUS.CANCELLED, reason);
        loadAppointments();
        loadDashboardStats();
    }
}

// View user
function viewUser(userId) {
    const user = AdminModule.getUserById(userId);
    if (!user) return;

    alert(`Thông tin người dùng:\n\nTên: ${user.name}\nEmail: ${user.email}\nSĐT: ${user.phone || 'N/A'}\nVai trò: ${getRoleText(user.role)}\nNgày tạo: ${formatDate(user.createdAt)}`);
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function getStatusClass(status) {
    switch(status) {
        case 'pending': return 'warning';
        case 'confirmed': return 'success';
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Chờ xác nhận';
        case 'confirmed': return 'Đã xác nhận';
        case 'completed': return 'Hoàn thành';
        case 'cancelled': return 'Đã hủy';
        default: return status;
    }
}

function getRoleText(role) {
    switch(role) {
        case 'admin': return 'Admin';
        case 'doctor': return 'Bác sĩ';
        case 'patient': return 'Bệnh nhân';
        default: return role;
    }
}