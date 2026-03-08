/**
 * MAIN APP - Khởi động ứng dụng
 */

const App = {
  /**
   * Khởi động ứng dụng
   */
  init() {
    console.log('🚀 HealthSlot App initialized');

    // Cập nhật navbar
    this.updateNavbar();

    // Khởi tạo event listeners
    this.initEventListeners();

    // Kiểm tra thông báo cần nhắc
    this.checkReminders();
  },

  /**
   * Cập nhật navbar
   */
  updateNavbar() {
    const user = AuthModule.getCurrentUser();

    // Cập nhật nút đăng nhập
    const authBtn = document.querySelector('[data-auth-btn]');
    if (authBtn) {
      if (user) {
        authBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
        authBtn.href = '/pages/profile.html';
        authBtn.style.cursor = 'pointer';
      } else {
        authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
        authBtn.href = '/pages/login.html';
      }
    }

    // Cập nhật badge thông báo
    const notificationBadge = document.querySelector('[data-notification-badge]');
    if (notificationBadge && user) {
      const unreadCount = NotificationModule.getUnread().length;
      if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = 'block';
      } else {
        notificationBadge.style.display = 'none';
      }
    }
  },

  /**
   * Khởi tạo event listeners
   */
  initEventListeners() {
    // Logout button
    document.querySelectorAll('[data-logout-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
          AuthModule.logout();
          window.location.href = '/';
        }
      });
    });

    // Notification bell
    const notificationBtn = document.querySelector('[data-notification-btn]');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        this.showNotifications();
      });
    }

    // Back button
    document.querySelectorAll('[data-back-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.history.back();
      });
    });
  },

  /**
   * Hiển thị thông báo
   */
  showNotifications() {
    const notifications = NotificationModule.getAll();

    if (notifications.length === 0) {
      NotificationModule.showToast('Thông báo', 'Không có thông báo nào', 'system');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div class="notification-modal-content">
        <div class="notification-modal-header">
          <h3>
            <i class="fas fa-bell"></i> Thông báo
            ${NotificationModule.getUnread().length > 0 ? `<span class="badge">${NotificationModule.getUnread().length}</span>` : ''}
          </h3>
          <button class="btn-close">&times;</button>
        </div>
        <div class="notification-list">
          ${notifications.map(n => `
            <div class="notification-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
              <div class="notification-icon">
                <i class="fas ${this.getNotificationIcon(n.type)}"></i>
              </div>
              <div class="notification-content">
                <div class="notification-title">${n.title}</div>
                <div class="notification-message">${n.message}</div>
                <div class="notification-time">${this.formatTime(n.createdAt)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event handlers
    const closeBtn = modal.querySelector('.btn-close');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    // Mark as read
    modal.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const notificationId = item.dataset.id;
        NotificationModule.markAsRead(notificationId);
        item.classList.add('read');
        this.updateNavbar();
      });
    });
  },

  /**
   * Lấy icon thông báo
   */
  getNotificationIcon(type) {
    const icons = {
      'appointment': 'fa-calendar-check',
      'reminder': 'fa-clock',
      'system': 'fa-bell',
      'message': 'fa-envelope'
    };
    return icons[type] || icons['system'];
  },

  /**
   * Format thời gian
   */
  formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  },

  /**
   * Kiểm tra nhắc lịch
   */
  checkReminders() {
    if (!AuthModule.isLoggedIn()) return;

    // Kiểm tra mỗi 30 phút
    setInterval(() => {
      NotificationModule.addAppointmentReminders();
    }, 30 * 60 * 1000);
  },

  /**
   * Utility: Format số tiền
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  /**
   * Utility: Format ngày
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// Khởi động app khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export cho console debugging
window.App = App;
window.AuthModule = AuthModule;
window.DoctorModule = DoctorModule;
window.AppointmentModule = AppointmentModule;
window.NotificationModule = NotificationModule;
