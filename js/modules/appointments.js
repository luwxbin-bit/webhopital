/**
 * APPOINTMENTS MODULE - Quản lý đặt lịch khám
 */

const AppointmentModule = {
  /**
   * Đặt lịch mới
   */
  book(appointmentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate
        const user = AuthModule.getCurrentUser();
        if (!user) {
          resolve({ success: false, message: 'Vui lòng đăng nhập để đặt lịch' });
          return;
        }

        const { doctorId, date, time, symptoms, appointmentType } = appointmentData;

        if (!doctorId || !date || !time) {
          resolve({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
          return;
        }

        // Kiểm tra slot có trống
        const slots = DoctorModule.getAvailableSlots(doctorId, date);
        if (!slots.includes(time)) {
          resolve({ success: false, message: 'Slot này đã được đặt. Vui lòng chọn slot khác' });
          return;
        }

        // Tạo appointment
        const appointment = AppointmentStorage.add({
          userId: user.id,
          userName: user.name,
          userPhone: user.phone,
          doctorId,
          doctorName: DoctorModule.getById(doctorId).name,
          doctorSpecialty: DoctorModule.getById(doctorId).specialty,
          date,
          time,
          symptoms: symptoms || '',
          appointmentType: appointmentType || 'consultation',
          status: CONSTANTS.APPOINTMENT_STATUS.PENDING,
          notes: ''
        });

        // Tạo notification
        NotificationModule.add({
          type: CONSTANTS.NOTIFICATION_TYPES.APPOINTMENT,
          title: 'Đặt lịch khám mới',
          message: `Bạn đã đặt lịch khám với BS ${appointment.doctorName} vào ${appointment.date} lúc ${appointment.time}`,
          relatedId: appointment.id
        });

        resolve({ success: true, message: 'Đặt lịch thành công', appointment });
      }, 500);
    });
  },

  /**
   * Lấy lịch hẹn của user
   */
  getUserAppointments(userId = null) {
    const user = AuthModule.getCurrentUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) return [];

    return AppointmentStorage.getAll().filter(a => a.userId === targetUserId);
  },

  /**
   * Hủy lịch hẹn
   */
  cancel(appointmentId, reason = '') {
    const appointment = AppointmentStorage.getById(appointmentId);
    if (!appointment) {
      return { success: false, message: 'Lịch hẹn không tồn tại' };
    }

    if (appointment.status === CONSTANTS.APPOINTMENT_STATUS.CANCELLED) {
      return { success: false, message: 'Lịch hẹn đã được hủy' };
    }

    const updated = AppointmentStorage.update(appointmentId, {
      status: CONSTANTS.APPOINTMENT_STATUS.CANCELLED,
      cancelledReason: reason,
      cancelledAt: new Date().toISOString()
    });

    // Tạo notification
    NotificationModule.add({
      type: CONSTANTS.NOTIFICATION_TYPES.APPOINTMENT,
      title: 'Lịch hẹn đã hủy',
      message: `Bạn đã hủy lịch khám với BS ${appointment.doctorName}`,
      relatedId: appointmentId
    });

    return { success: true, message: 'Hủy lịch thành công', appointment: updated };
  },

  /**
   * Cập nhật lịch hẹn
   */
  update(appointmentId, updates) {
    const appointment = AppointmentStorage.getById(appointmentId);
    if (!appointment) {
      return { success: false, message: 'Lịch hẹn không tồn tại' };
    }

    const updated = AppointmentStorage.update(appointmentId, updates);
    return { success: true, message: 'Cập nhật lịch thành công', appointment: updated };
  },

  /**
   * Lấy chi tiết lịch hẹn
   */
  getDetail(appointmentId) {
    return AppointmentStorage.getById(appointmentId);
  },

  /**
   * Lấy lịch hẹn sắp tới
   */
  getUpcoming() {
    const user = AuthModule.getCurrentUser();
    if (!user) return [];

    const today = new Date().toISOString().split('T')[0];
    return this.getUserAppointments()
      .filter(a => a.date >= today && a.status !== CONSTANTS.APPOINTMENT_STATUS.CANCELLED)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /**
   * Lấy lịch hẹn trong quá khứ
   */
  getPast() {
    const user = AuthModule.getCurrentUser();
    if (!user) return [];

    const today = new Date().toISOString().split('T')[0];
    return this.getUserAppointments()
      .filter(a => a.date < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * Format date
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  },

  /**
   * Tính thời gian còn lại
   */
  getTimeRemaining(date, time) {
    const appointmentTime = new Date(`${date} ${time}`);
    const now = new Date();
    const diff = appointmentTime - now;

    if (diff <= 0) return 'Đã qua';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Còn ${days} ngày`;
    }
    return `Còn ${hours} giờ ${minutes} phút`;
  }
};
