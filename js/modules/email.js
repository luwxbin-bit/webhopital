/**
 * EmailModule - Hệ thống gửi email thông báo
 * Sử dụng EmailJS để gửi email thực
 */

class EmailModule {
  constructor() {
    // EmailJS configuration
    this.serviceId = 'service_webhopital'; // Replace with your EmailJS service ID
    this.templateIds = {
      appointmentConfirmation: 'template_appointment_confirm',
      appointmentReminder: 'template_appointment_reminder',
      appointmentCancelled: 'template_appointment_cancelled',
      registrationWelcome: 'template_welcome'
    };
    this.publicKey = 'your_public_key'; // Replace with your EmailJS public key

    this.isInitialized = false;
  }

  /**
   * Khởi tạo EmailJS
   */
  initialize() {
    if (this.isInitialized) return true;

    try {
      // Load EmailJS script dynamically
      if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/emailjs.min.js';
        script.onload = () => {
          emailjs.init(this.publicKey);
          this.isInitialized = true;
          console.log('EmailJS initialized successfully');
        };
        script.onerror = () => {
          console.warn('Failed to load EmailJS. Email notifications will be disabled.');
        };
        document.head.appendChild(script);
      } else {
        emailjs.init(this.publicKey);
        this.isInitialized = true;
      }
      return true;
    } catch (error) {
      console.warn('EmailJS initialization failed:', error);
      return false;
    }
  }

  /**
   * Gửi email xác nhận lịch hẹn
   */
  async sendAppointmentConfirmation(appointment, patient, doctor) {
    if (!this.isInitialized) {
      console.log('Email not sent: EmailJS not initialized');
      return false;
    }

    try {
      const templateParams = {
        to_email: patient.email,
        to_name: patient.name,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        appointment_date: this.formatDate(appointment.date),
        appointment_time: appointment.time,
        hospital_name: doctor.hospital,
        appointment_id: appointment.id,
        patient_phone: appointment.phone || 'N/A',
        symptoms: appointment.symptoms || 'Không có triệu chứng cụ thể'
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templateIds.appointmentConfirmation,
        templateParams
      );

      console.log('Appointment confirmation email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send appointment confirmation email:', error);
      return false;
    }
  }

  /**
   * Gửi email nhắc lịch hẹn
   */
  async sendAppointmentReminder(appointment, patient, doctor, hoursBefore = 24) {
    if (!this.isInitialized) {
      console.log('Email not sent: EmailJS not initialized');
      return false;
    }

    try {
      const templateParams = {
        to_email: patient.email,
        to_name: patient.name,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        appointment_date: this.formatDate(appointment.date),
        appointment_time: appointment.time,
        hospital_name: doctor.hospital,
        hours_before: hoursBefore,
        appointment_id: appointment.id
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templateIds.appointmentReminder,
        templateParams
      );

      console.log('Appointment reminder email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send appointment reminder email:', error);
      return false;
    }
  }

  /**
   * Gửi email hủy lịch hẹn
   */
  async sendAppointmentCancellation(appointment, patient, doctor, reason = '') {
    if (!this.isInitialized) {
      console.log('Email not sent: EmailJS not initialized');
      return false;
    }

    try {
      const templateParams = {
        to_email: patient.email,
        to_name: patient.name,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        appointment_date: this.formatDate(appointment.date),
        appointment_time: appointment.time,
        hospital_name: doctor.hospital,
        cancellation_reason: reason || 'Lý do không được cung cấp',
        appointment_id: appointment.id
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templateIds.appointmentCancelled,
        templateParams
      );

      console.log('Appointment cancellation email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send appointment cancellation email:', error);
      return false;
    }
  }

  /**
   * Gửi email chào mừng đăng ký
   */
  async sendWelcomeEmail(user) {
    if (!this.isInitialized) {
      console.log('Email not sent: EmailJS not initialized');
      return false;
    }

    try {
      const templateParams = {
        to_email: user.email,
        to_name: user.name,
        registration_date: this.formatDate(user.createdAt),
        login_url: window.location.origin + '/pages/login.html'
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templateIds.registrationWelcome,
        templateParams
      );

      console.log('Welcome email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Gửi email thông báo hệ thống
   */
  async sendSystemNotification(email, subject, message) {
    if (!this.isInitialized) {
      console.log('Email not sent: EmailJS not initialized');
      return false;
    }

    try {
      const templateParams = {
        to_email: email,
        subject: subject,
        message: message,
        system_name: 'WebHopital'
      };

      // Using a generic template for system notifications
      const result = await emailjs.send(
        this.serviceId,
        'template_system_notification',
        templateParams
      );

      console.log('System notification email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send system notification email:', error);
      return false;
    }
  }

  /**
   * Kiểm tra trạng thái EmailJS
   */
  isReady() {
    return this.isInitialized && window.emailjs;
  }

  /**
   * Format date for email templates
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Mock email sending (for development/testing)
   */
  mockSend(template, params) {
    console.log('📧 MOCK EMAIL SENT:');
    console.log('Template:', template);
    console.log('Parameters:', params);
    console.log('---');

    // Simulate async operation
    return new Promise(resolve => {
      setTimeout(() => resolve({ status: 200, text: 'OK' }), 1000);
    });
  }
}

// Khởi tạo module
const EmailModule = new EmailModule();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  EmailModule.initialize();
});

// Export cho global scope
window.EmailModule = EmailModule;