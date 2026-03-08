/**
 * AdminModule - Quản lý chức năng admin
 * - Quản lý bác sĩ (CRUD)
 * - Quản lý lịch hẹn
 * - Quản lý người dùng
 * - Thống kê hệ thống
 */

class AdminModule {
  constructor() {
    this.currentUser = null;
  }

  /**
   * Kiểm tra quyền admin
   */
  isAdmin() {
    const user = AuthModule.getCurrentUser();
    return user && user.role === CONSTANTS.ROLES.ADMIN;
  }

  /**
   * Bảo vệ trang admin - redirect nếu không phải admin
   */
  protectAdminPage() {
    if (!this.isAdmin()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  /**
   * Lấy tất cả người dùng
   */
  getAllUsers() {
    if (!this.isAdmin()) return [];
    const users = JSON.parse(localStorage.getItem('webhopital_users') || '[]');
    return users;
  }

  /**
   * Lấy tất cả lịch hẹn
   */
  getAllAppointments() {
    if (!this.isAdmin()) return [];
    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    return appointments.map(apt => ({
      ...apt,
      doctor: DEMO_DOCTORS.find(d => d.id === apt.doctorId),
      patient: this.getUserById(apt.patientId)
    }));
  }

  /**
   * Lấy người dùng theo ID
   */
  getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(u => u.id === userId);
  }

  /**
   * Thêm bác sĩ mới
   */
  addDoctor(doctorData) {
    if (!this.isAdmin()) return false;

    const doctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');
    const newDoctor = {
      id: Date.now(),
      ...doctorData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    doctors.push(newDoctor);
    localStorage.setItem(CONSTANTS.STORAGE.DOCTORS, JSON.stringify(doctors));

    NotificationModule.add({
      type: CONSTANTS.NOTIFICATION_TYPES.SYSTEM,
      title: 'Bác sĩ mới',
      message: `Đã thêm bác sĩ ${doctorData.name}`,
      timestamp: new Date().toISOString()
    });

    return newDoctor;
  }

  /**
   * Cập nhật bác sĩ
   */
  updateDoctor(doctorId, updates) {
    if (!this.isAdmin()) return false;

    const doctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');
    const index = doctors.findIndex(d => d.id === doctorId);

    if (index === -1) return false;

    doctors[index] = { ...doctors[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(CONSTANTS.STORAGE.DOCTORS, JSON.stringify(doctors));

    NotificationModule.add({
      type: CONSTANTS.NOTIFICATION_TYPES.SYSTEM,
      title: 'Cập nhật bác sĩ',
      message: `Đã cập nhật thông tin bác sĩ ${doctors[index].name}`,
      timestamp: new Date().toISOString()
    });

    return doctors[index];
  }

  /**
   * Xóa bác sĩ
   */
  deleteDoctor(doctorId) {
    if (!this.isAdmin()) return false;

    const doctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');
    const doctor = doctors.find(d => d.id === doctorId);

    if (!doctor) return false;

    const filteredDoctors = doctors.filter(d => d.id !== doctorId);
    localStorage.setItem(CONSTANTS.STORAGE.DOCTORS, JSON.stringify(filteredDoctors));

    // Hủy tất cả lịch hẹn của bác sĩ này
    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    const updatedAppointments = appointments.map(apt => {
      if (apt.doctorId === doctorId && apt.status !== CONSTANTS.APPOINTMENT_STATUS.COMPLETED) {
        return { ...apt, status: CONSTANTS.APPOINTMENT_STATUS.CANCELLED, cancelledReason: 'Bác sĩ không còn làm việc' };
      }
      return apt;
    });
    localStorage.setItem(CONSTANTS.STORAGE.APPOINTMENTS, JSON.stringify(updatedAppointments));

    NotificationModule.add({
      type: CONSTANTS.NOTIFICATION_TYPES.SYSTEM,
      title: 'Xóa bác sĩ',
      message: `Đã xóa bác sĩ ${doctor.name} và hủy các lịch hẹn liên quan`,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Cập nhật trạng thái lịch hẹn
   */
  updateAppointmentStatus(appointmentId, newStatus, notes = '') {
    if (!this.isAdmin()) return false;

    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    const index = appointments.findIndex(a => a.id === appointmentId);

    if (index === -1) return false;

    appointments[index].status = newStatus;
    appointments[index].updatedAt = new Date().toISOString();

    if (notes) {
      appointments[index].adminNotes = notes;
    }

    localStorage.setItem(CONSTANTS.STORAGE.APPOINTMENTS, JSON.stringify(appointments));

    // Thông báo cho bệnh nhân
    const appointment = appointments[index];
    const patient = this.getUserById(appointment.patientId);

    if (patient) {
      NotificationModule.add({
        type: CONSTANTS.NOTIFICATION_TYPES.APPOINTMENT,
        title: 'Cập nhật lịch hẹn',
        message: `Lịch hẹn của bạn với ${DEMO_DOCTORS.find(d => d.id === appointment.doctorId)?.name} đã được ${newStatus}`,
        userId: patient.id,
        timestamp: new Date().toISOString()
      });
    }

    return appointment;
  }

  /**
   * Thống kê hệ thống
   */
  getSystemStats() {
    if (!this.isAdmin()) return null;

    const users = this.getAllUsers();
    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    const doctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalUsers: users.length,
      totalDoctors: DEMO_DOCTORS.length + doctors.length,
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(a => a.status === CONSTANTS.APPOINTMENT_STATUS.PENDING).length,
      confirmedAppointments: appointments.filter(a => a.status === CONSTANTS.APPOINTMENT_STATUS.CONFIRMED).length,
      completedAppointments: appointments.filter(a => a.status === CONSTANTS.APPOINTMENT_STATUS.COMPLETED).length,
      cancelledAppointments: appointments.filter(a => a.status === CONSTANTS.APPOINTMENT_STATUS.CANCELLED).length,
      thisMonthAppointments: appointments.filter(a => new Date(a.createdAt) >= thisMonth).length,
      revenue: appointments
        .filter(a => a.status === CONSTANTS.APPOINTMENT_STATUS.COMPLETED)
        .reduce((sum, a) => sum + (a.fee || 0), 0)
    };
  }

  /**
   * Tạo tài khoản admin mặc định
   */
  createDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('webhopital_users') || '[]');
    const adminExists = users.some(u => u.role === CONSTANTS.ROLES.ADMIN);

    if (!adminExists) {
      const adminUser = {
        id: Date.now(),
        email: 'admin@webhopital.com',
        password: 'admin123', // Trong thực tế nên hash
        name: 'Administrator',
        role: CONSTANTS.ROLES.ADMIN,
        phone: '0123456789',
        address: '123 Admin Street',
        createdAt: new Date().toISOString()
      };

      users.push(adminUser);
      localStorage.setItem('webhopital_users', JSON.stringify(users));

      console.log('Default admin account created: admin@webhopital.com / admin123');
    }
  }

  /**
   * Reset hệ thống (chỉ dành cho development)
   */
  resetSystem() {
    if (!this.isAdmin()) return false;

    if (confirm('Bạn có chắc muốn reset toàn bộ hệ thống? Tất cả dữ liệu sẽ bị xóa!')) {
      localStorage.removeItem('webhopital_users');
      localStorage.removeItem(CONSTANTS.STORAGE.APPOINTMENTS);
      localStorage.removeItem(CONSTANTS.STORAGE.DOCTORS);
      localStorage.removeItem(CONSTANTS.STORAGE.NOTIFICATIONS);

      this.createDefaultAdmin();

      NotificationModule.add({
        type: CONSTANTS.NOTIFICATION_TYPES.SYSTEM,
        title: 'Hệ thống đã reset',
        message: 'Tất cả dữ liệu đã được xóa và tạo lại tài khoản admin mặc định',
        timestamp: new Date().toISOString()
      });

      return true;
    }
    return false;
  }
}

// Khởi tạo module
const AdminModule = new AdminModule();

// Tạo admin mặc định khi load
AdminModule.createDefaultAdmin();

// Export cho global scope
window.AdminModule = AdminModule;