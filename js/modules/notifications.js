/**
 * NOTIFICATIONS MODULE - Quản lý thông báo hệ thống
 */

const NotificationModule = {
  /**
   * Thêm thông báo
   */
  add(notificationData) {
    const { type, title, message, relatedId = null } = notificationData;

    const notification = NotificationStorage.add({
      type,
      title,
      message,
      relatedId
    });

    // Hiển thị toast nếu trang đang mở
    this.showToast(title, message, type);

    return notification;
  },

  /**
   * Lấy tất cả thông báo
   */
  getAll() {
    return NotificationStorage.getAll();
  },

  /**
   * Lấy thông báo chưa đọc
   */
  getUnread() {
    return NotificationStorage.getUnread();
  },

  /**
   * Đánh dấu thông báo đã đọc
   */
  markAsRead(id) {
    return NotificationStorage.markAsRead(id);
  },

  /**
   * Đánh dấu tất cả đã đọc
   */
  markAllAsRead() {
    const notifications = this.getAll();
    notifications.forEach(n => {
      if (!n.read) {
        NotificationStorage.markAsRead(n.id);
      }
    });
  },

  /**
   * Hiển thị toast notification
   */
  showToast(title, message, type = 'system') {
    // Nếu element toast container không tồn tại, tạo mới
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      margin-bottom: 10px;
      padding: 15px 20px;
      background: ${this.getToastColor(type)};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
      pointer-events: auto;
      cursor: pointer;
    `;

    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 5px;">${title}</div>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Click to close
    toast.onclick = () => {
      toast.remove();
    };
  },

  /**
   * Hiểm zoom notification
   */
  showNotificationCenter() {
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div class="notification-modal-content">
        <div class="notification-modal-header">
          <h3>Thông báo</h3>
          <button class="btn-close">&times;</button>
        </div>
        <div class="notification-list">
          <!-- Notifications will be added here -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.btn-close');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  },

  /**
   * Lấy màu toast
   */
  getToastColor(type) {
    const colors = {
      'appointment': '#4CAF50',
      'reminder': '#2196F3',
      'system': '#FF9800',
      'message': '#9C27B0',
      'error': '#F44336',
      'success': '#4CAF50'
    };
    return colors[type] || colors['system'];
  },

  /**
   * Thêm reminder notification cho lịch khám sắp tới
   */
  addAppointmentReminders() {
    const appointments = AppointmentModule.getUpcoming();
    const now = new Date();

    appointments.forEach(apt => {
      const appointmentTime = new Date(`${apt.date} ${apt.time}`);
      const diffHours = (appointmentTime - now) / (1000 * 60 * 60);

      // Nhắc 1 ngày trước
      if (Math.abs(diffHours - 24) < 1) {
        this.add({
          type: CONSTANTS.NOTIFICATION_TYPES.REMINDER,
          title: 'Nhắc lịch khám',
          message: `Ngày mai bạn có lịch khám với BS ${apt.doctorName} lúc ${apt.time}`,
          relatedId: apt.id
        });
      }

      // Nhắc 2 giờ trước
      if (Math.abs(diffHours - 2) < 0.5) {
        this.add({
          type: CONSTANTS.NOTIFICATION_TYPES.REMINDER,
          title: 'Nhắc lịch khám',
          message: `Lịch khám của bạn sẽ bắt đầu trong 2 giờ nữa`,
          relatedId: apt.id
        });
      }
    });
  }
};

// CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .notification-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .notification-modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .notification-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .notification-modal-header h3 {
    margin: 0;
    font-size: 20px;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
  }
`;
document.head.appendChild(style);
