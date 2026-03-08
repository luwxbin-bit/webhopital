/**
 * AUTH MODULE - Quản lý đăng nhập, đăng ký, xác thực
 */

const AuthModule = {
  /**
   * Đăng ký người dùng mới
   */
  signup(name, email, password, phone = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate
        if (!name || !email || !password) {
          resolve({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
          return;
        }

        if (password.length < 6) {
          resolve({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
          return;
        }

        // Kiểm tra email đã tồn tại
        const users = StorageManager.get('webhopital_users_db', []);
        if (users.find(u => u.email === email)) {
          resolve({ success: false, message: 'Email đã được đăng ký' });
          return;
        }

        // Tạo user mới
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          phone,
          role: CONSTANTS.ROLES.PATIENT,
          createdAt: new Date().toISOString()
        };

        // Lưu password (thực tế nên hash)
        const userWithPassword = { ...user, password };
        users.push(userWithPassword);
        StorageManager.set('webhopital_users_db', users);

        // Tạo token
        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        UserStorage.setUser(user);
        UserStorage.setToken(token);

        resolve({ success: true, message: 'Đăng ký thành công', user });
      }, 500);
    });
  },

  /**
   * Đăng nhập
   */
  login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!email || !password) {
          resolve({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
          return;
        }

        const users = StorageManager.get('webhopital_users_db', []);
        const user = users.find(u => u.email === email);

        if (!user) {
          resolve({ success: false, message: 'Email hoặc mật khẩu không đúng' });
          return;
        }

        if (user.password !== password) {
          resolve({ success: false, message: 'Email hoặc mật khẩu không đúng' });
          return;
        }

        // Đăng nhập thành công
        const { password: _, ...userWithoutPassword } = user;
        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        UserStorage.setUser(userWithoutPassword);
        UserStorage.setToken(token);

        resolve({ success: true, message: 'Đăng nhập thành công', user: userWithoutPassword });
      }, 500);
    });
  },

  /**
   * Đăng xuất
   */
  logout() {
    UserStorage.logout();
    return { success: true, message: 'Đã đăng xuất' };
  },

  /**
   * Lấy user hiện tại
   */
  getCurrentUser() {
    return UserStorage.getUser();
  },

  /**
   * Kiểm tra đã đăng nhập
   */
  isLoggedIn() {
    return UserStorage.isLoggedIn();
  },

  /**
   * Cập nhật profile
   */
  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Chưa đăng nhập' };

    const updatedUser = { ...user, ...updates };
    UserStorage.setUser(updatedUser);

    return { success: true, message: 'Cập nhật thành công', user: updatedUser };
  },

  /**
   * Bảo vệ page - redirect nếu chưa đăng nhập
   */
  protectPage() {
    if (!this.isLoggedIn()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  }
};

// Auto-run khi load trang
document.addEventListener('DOMContentLoaded', () => {
  // Update navbar với tên user nếu đã đăng nhập
  const user = AuthModule.getCurrentUser();
  if (user) {
    const loginBtn = document.querySelector('[data-auth-btn]');
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
      loginBtn.href = '/pages/profile.html';
    }
  }
});
