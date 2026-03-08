/**
 * CONSTANTS - Các hằng số và cấu hình hệ thống
 */

const CONSTANTS = {
  // Storage keys
  STORAGE: {
    USER: 'webhopital_user',
    TOKEN: 'webhopital_token',
    APPOINTMENTS: 'webhopital_appointments',
    DOCTORS: 'webhopital_doctors',
    NOTIFICATIONS: 'webhopital_notifications',
    THEME: 'webhopital_theme'
  },

  // Roles
  ROLES: {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin'
  },

  // Appointment status
  APPOINTMENT_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    APPOINTMENT: 'appointment',
    REMINDER: 'reminder',
    SYSTEM: 'system',
    MESSAGE: 'message'
  },

  // Specialties
  SPECIALTIES: [
    'Tim mạch',
    'Tai mũi họng',
    'Nội tổng quát',
    'Phụ khoa',
    'Nhi khoa',
    'Chỉnh hình',
    'Hóa học lâm sàng',
    'Mắt',
    'Ngoại khoa',
    'Da liễu',
    'Tâm thần',
    'Nha khoa',
    'Cột sống',
    'Tiêu hóa',
    'Hô hấp'
  ],

  // Time slots
  TIME_SLOTS: [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00'
  ],

  // API endpoints (for future backend integration)
  API: {
    BASE_URL: window.location.origin,
    LOGIN: '/api/login',
    SIGNUP: '/api/signup',
    DOCTORS: '/api/doctors',
    APPOINTMENTS: '/api/appointments',
    PROFILE: '/api/profile'
  }
};

// Demo data - Bác sĩ mẫu
const DEMO_DOCTORS = [
  { id: 1, name: 'BS Nguyễn Văn A', specialty: 'Tim mạch', hospital: 'BV Quân Dân Y Miền Đông', experience: '15 năm', image: 'avatar', rating: 4.8 },
  { id: 2, name: 'BS Trần Thị B', specialty: 'Tai mũi họng', hospital: 'BV Quân Dân Y Miền Đông', experience: '12 năm', image: 'avatar', rating: 4.6 },
  { id: 3, name: 'BS Lê Văn C', specialty: 'Nội tổng quát', hospital: 'BV Quân Dân Y Miền Đông', experience: '10 năm', image: 'avatar', rating: 4.7 },
  { id: 4, name: 'BS Phạm Thị D', specialty: 'Phụ khoa', hospital: 'BV Quân Dân Y Miền Đông', experience: '8 năm', image: 'avatar', rating: 4.9 },
  { id: 5, name: 'BS Đỗ Văn E', specialty: 'Nhi khoa', hospital: 'BV Quân Dân Y Miền Đông', experience: '9 năm', image: 'avatar', rating: 4.5 },
];

Object.freeze(CONSTANTS);
Object.freeze(DEMO_DOCTORS);
