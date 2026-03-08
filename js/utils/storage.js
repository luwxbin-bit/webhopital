/**
 * STORAGE - Quản lý dữ liệu localStorage
 */

const StorageManager = {
  /**
   * Lưu dữ liệu vào localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Storage set error:', err);
      return false;
    }
  },

  /**
   * Lấy dữ liệu từ localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error('Storage get error:', err);
      return defaultValue;
    }
  },

  /**
   * Xóa dữ liệu
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error('Storage remove error:', err);
      return false;
    }
  },

  /**
   * Xóa tất cả dữ liệu
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error('Storage clear error:', err);
      return false;
    }
  },

  /**
   * Kiểm tra key có tồn tại
   */
  exists(key) {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Lấy tất cả key
   */
  keys() {
    return Object.keys(localStorage);
  }
};

// Helpers cho user
const UserStorage = {
  setUser(user) {
    return StorageManager.set(CONSTANTS.STORAGE.USER, user);
  },

  getUser() {
    return StorageManager.get(CONSTANTS.STORAGE.USER);
  },

  setToken(token) {
    return StorageManager.set(CONSTANTS.STORAGE.TOKEN, token);
  },

  getToken() {
    return StorageManager.get(CONSTANTS.STORAGE.TOKEN);
  },

  isLoggedIn() {
    return !!this.getUser() && !!this.getToken();
  },

  logout() {
    StorageManager.remove(CONSTANTS.STORAGE.USER);
    StorageManager.remove(CONSTANTS.STORAGE.TOKEN);
  }
};

// Helpers cho appointments
const AppointmentStorage = {
  getAll() {
    return StorageManager.get(CONSTANTS.STORAGE.APPOINTMENTS, []);
  },

  add(appointment) {
    const appointments = this.getAll();
    appointment.id = Math.random().toString(36).substr(2, 9);
    appointment.createdAt = new Date().toISOString();
    appointments.push(appointment);
    StorageManager.set(CONSTANTS.STORAGE.APPOINTMENTS, appointments);
    return appointment;
  },

  update(id, updates) {
    const appointments = this.getAll();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      StorageManager.set(CONSTANTS.STORAGE.APPOINTMENTS, appointments);
      return appointments[index];
    }
    return null;
  },

  delete(id) {
    const appointments = this.getAll();
    const filtered = appointments.filter(a => a.id !== id);
    StorageManager.set(CONSTANTS.STORAGE.APPOINTMENTS, filtered);
    return true;
  },

  getById(id) {
    const appointments = this.getAll();
    return appointments.find(a => a.id === id);
  }
};

// Helpers cho notifications
const NotificationStorage = {
  getAll() {
    return StorageManager.get(CONSTANTS.STORAGE.NOTIFICATIONS, []);
  },

  add(notification) {
    const notifications = this.getAll();
    notification.id = Math.random().toString(36).substr(2, 9);
    notification.createdAt = new Date().toISOString();
    notification.read = false;
    notifications.unshift(notification);
    StorageManager.set(CONSTANTS.STORAGE.NOTIFICATIONS, notifications);
    return notification;
  },

  markAsRead(id) {
    const notifications = this.getAll();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      StorageManager.set(CONSTANTS.STORAGE.NOTIFICATIONS, notifications);
    }
    return notification;
  },

  getUnread() {
    const notifications = this.getAll();
    return notifications.filter(n => !n.read);
  }
};
