# WebHopital - Medical Appointment Booking System
**Hệ thống Đặt Lịch Khám Bệnh Trực tuyến**

A modern, static web application for booking medical appointments with complete user management system.

## ✨ Core Features | Tính năng chính

- ✅ **User Authentication** - Sign up, login, logout with localStorage persistence
- ✅ **Doctor Directory** - Browse doctors, filter by specialty, search functionality
- ✅ **Appointment Booking** - 3-step booking process with date/time selection
- ✅ **Appointment Management** - View, reschedule, cancel appointments
- ✅ **User Profile** - Edit personal info, change password, view statistics
- ✅ **Notifications** - Toast notifications and notification center
- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **No Backend Required** - All data stored in browser localStorage

## 🚀 Live Demo

**Visit**: https://luwxbin-bit.github.io/webhopital

## 📁 Project Structure

```
webhopital/
├── index.html                          # Homepage with hero & featured doctors
├── css/
│   └── style.css                      # Comprehensive responsive styling (~1000 lines)
├── js/
│   ├── app.js                         # Main app initialization (220 lines)
│   ├── utils/
│   │   ├── constants.js               # Global constants & demo data
│   │   └── storage.js                 # localStorage abstraction layer
│   └── modules/
│       ├── auth.js                    # Authentication module
│       ├── doctors.js                 # Doctor management
│       ├── appointments.js            # Appointment booking & tracking
│       └── notifications.js           # Notification system
└── pages/
    ├── login.html                     # Login page (220 lines)
    ├── signup.html                    # Signup with validation (280 lines)
    ├── doctors.html                   # Doctor directory with filters (280 lines)
    ├── booking.html                   # Multi-step booking form (350 lines)
    ├── my-appointments.html          # Appointment history (320 lines)
    └── profile.html                   # User profile & account settings (430 lines)
```

## 🛠️ Technology Stack

| Technology | Details |
|-----------|---------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **Data Storage** | localStorage (client-side only) |
| **Hosting** | GitHub Pages |
| **Icons** | Font Awesome 6.0.0 |
| **Backend** | None - Static site |
| **Database** | None - localStorage |

## 🎯 Key Modules

### 1. Authentication (`js/modules/auth.js`)
```javascript
AuthModule.signup(email, password)          // Create new account
AuthModule.login(email, password)           // Login user
AuthModule.logout()                         // Logout
AuthModule.getCurrentUser()                 // Get logged-in user
AuthModule.updateProfile(updates)           // Update user info
AuthModule.protectPage()                    // Redirect if not logged in
```

### 2. Doctor Management (`js/modules/doctors.js`)
```javascript
DoctorModule.getAll()                       // Get all doctors
DoctorModule.filterBySpecialty(specialty)   // Filter by specialty
DoctorModule.search(query)                  // Search by name/specialty
DoctorModule.getAvailableSlots(doctorId)    // Get available time slots
DoctorModule.getFeatured()                  // Get top 6 doctors
```

### 3. Appointments (`js/modules/appointments.js`)
```javascript
AppointmentModule.book(data)                // Book appointment
AppointmentModule.getUserAppointments(id)   // Get user's appointments
AppointmentModule.getUpcoming(id)           // Get upcoming appointments
AppointmentModule.getPast(id)               // Get past appointments
AppointmentModule.cancel(appointmentId)     // Cancel appointment
AppointmentModule.update(id, updates)       // Reschedule appointment
```

### 4. Notifications (`js/modules/notifications.js`)
```javascript
NotificationModule.add(notification)        // Add & show notification
NotificationModule.showToast(message, type) // Show toast notification
NotificationModule.getUnread()              // Get unread notifications
NotificationModule.markAsRead(id)           // Mark as read
```

### 5. Storage (`js/utils/storage.js`)
```javascript
UserStorage.setLoggedInUser(user)           // Save user session
AppointmentStorage.add(appointment)         // Save appointment
NotificationStorage.add(notification)       // Save notification
```

## 📖 User Guide | Hướng dẫn Sử dụng

### Signing Up | Đăng Ký
1. Click **Sign Up** in navbar
2. Enter email, password, name
3. Check password requirements (min 6 chars, uppercase letter, number)
4. Accept Terms & Conditions
5. Click **Sign Up** - Auto redirect to home

### Logging In | Đăng Nhập
1. Click **Login** in navbar
2. Enter email and password
3. Check **Remember Email** to auto-fill next time
4. Click **Login** - Auto redirect to home if successful

### Booking Appointment | Đặt Lịch Khám
1. Click **Book Appointment** button
2. **Step 1**: Select doctor from dropdown
3. **Step 2**: Choose date and available time slot
4. **Step 3**: Enter patient name, phone, symptoms (optional)
5. Click **Confirm Booking**
6. Appointment saved to your account

### Managing Appointments | Quản Lý Lịch Hẹn
1. Go to **My Appointments** page
2. View **Upcoming**, **Past**, or **All** appointments
3. See appointment details and time remaining
4. Click **Reschedule** to change date/time
5. Click **Cancel** to cancel appointment

### Profile Management | Quản Lý Hồ Sơ
1. Click profile icon in navbar or go to **Profile**
2. **General Tab**: Edit name, phone, address, medical notes
3. **Security Tab**: Change password with confirmation
4. **Appointments Tab**: View recent upcoming appointments
5. **Logout Tab**: Click logout to end session

## 🔐 Default Demo Accounts | Tài khoản Demo

### Pre-loaded Test Accounts:
```
Email: patient1@example.com | Password: password123
Email: patient2@example.com | Password: password123
```

**Or use Sign Up page to create your own account**

### Demo Doctors Available:
- Dr. Nguyễn Văn A - Cardiology (4.8⭐)
- Dr. Trần Thị B - Neurology (4.7⭐)
- Dr. Hoàng Văn C - Dermatology (4.6⭐)
- Dr. Lý Thị D - Psychiatry (4.5⭐)
- Dr. Võ Văn E - Orthopedics (4.5⭐)

## 💾 Data Persistence

All data is stored in browser localStorage:
- **User accounts & sessions**: `webhopital_users`
- **Appointments**: `webhopital_appointments`
- **Notifications**: `webhopital_notifications`

**Data persists across browser sessions** until localStorage is cleared.

## 📱 Responsive Design

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Desktop | 1200px+ | Full sidebar + content |
| Tablet | 768px - 1199px | Adjusted margins |
| Mobile | < 768px | Single column, collapsed nav |

All pages are fully responsive and mobile-friendly.

## 🎨 Design Features

### Color Scheme
- **Primary**: Professional medical blue (#007bff)
- **Success**: Green for confirmed appointments (#28a745)
- **Warning**: Orange for pending (#ffc107)
- **Danger**: Red for cancelled/urgent (#dc3545)

### Components
- Clean, modern buttons with hover effects
- Card-based layout for content
- Form validation with error messages
- Toast notifications with auto-dismiss
- Status badges for appointments
- Responsive navigation bar

## 🚀 Deployment

### Option 1: Local Testing
```bash
# Clone repository
git clone https://github.com/luwxbin-bit/webhopital.git

# Open with Live Server (VS Code) or
python -m http.server 8000

# Visit http://localhost:8000
```

### Option 2: GitHub Pages (Already Configured)
The site is ready at: https://luwxbin-bit.github.io/webhopital

If Pages not enabled:
1. Go to repository **Settings** → **Pages**
2. Set Source to "Deploy from a branch"
3. Select **main** branch and **/** (root)
4. Save

## 🔮 Future Enhancements

### Phase 2 - Admin Dashboard
- [ ] Doctor management (CRUD)
- [ ] Appointment approval system
- [ ] User management
- [ ] Analytics & reporting

### Phase 3 - Backend Integration
- [ ] PostgreSQL database
- [ ] Node.js/Express API
- [ ] Email notifications
- [ ] SMS notifications

### Phase 4 - Advanced Features
- [ ] Prescription management
- [ ] Medical records
- [ ] Video consultation
- [ ] Payment integration

## 🐛 Troubleshooting

**Problem**: Data not saving after booking
- **Solution**: Check if localStorage is enabled in browser settings

**Problem**: Can't login after signup
- **Solution**: In private mode, data clears. Sign up again in normal mode

**Problem**: Styles look broken
- **Solution**: Clear browser cache (Ctrl+Shift+Delete) and reload

**Problem**: Getting module errors in console
- **Solution**: Ensure app.js is fully loaded before navigating

## 📞 Contact & Support

- **Repository**: https://github.com/luwxbin-bit/webhopital
- **Issues**: GitHub Issues page
- **Author**: WebHopital Development Team

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated**: December 2024  
**Status**: ✅ Fully Functional  
**Version**: 1.0.0 - Static Site Release

### Bác sĩ mẫu
- Email: `bs.nguyenvana@bvquandany.com`
- Password: `123456`

### Bệnh nhân mẫu
- Email: `nguyenvana@example.com`
- Password: `123456`

## Debug và Troubleshooting

### Server không khởi động được
```bash
# Dừng tất cả process Node.js
Stop-Process -Name node -Force

# Khởi động lại server
cd backend
npm start
```

### Database bị lỗi
```bash
# Xóa database cũ và tạo mới
cd backend
rm database.db
npm run init-db
npm start
```

### API không hoạt động
- Kiểm tra server có chạy trên port 3003
- Kiểm tra file .env có tồn tại và đúng cấu hình
- Test API bằng curl hoặc Postman

### Frontend không load được
- Đảm bảo server đang chạy
- Kiểm tra file static được serve từ thư mục frontend
- Mở Developer Tools (F12) để xem lỗi JavaScript

## Cấu trúc Dự án

```
webhopital/
├── backend/
│   ├── server.js          # Main server file
│   ├── init-db.js         # Database initialization
│   ├── schema.sql         # Database schema
│   ├── seed.sql          # Sample data
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
└── frontend/
    ├── index.html        # Homepage
    ├── login.html        # Login page
    ├── signup.html       # Registration page
    ├── doctors.html      # Doctors list
    ├── booking.html      # Appointment booking
    ├── profile.html      # User profile
    ├── my-appointments.html # User appointments
    ├── style.css         # Main stylesheet
    ├── auth.js           # Authentication helpers
    ├── app.js            # Main application logic
    └── chatbot.js        # Chatbot widget
```

## API Endpoints

### Authentication
- `POST /login` - Đăng nhập
- `POST /signup` - Đăng ký
- `POST /verify-token` - Xác minh token

### Data
- `GET /doctors` - Lấy danh sách bác sĩ
- `GET /user/:id` - Lấy thông tin user
- `POST /appointments` - Tạo lịch hẹn
- `GET /appointments/user/:user_id` - Lấy lịch hẹn của user

### Admin (yêu cầu authentication)
- `GET /api/admin/users` - Quản lý users
- `POST /api/admin/users` - Tạo user mới
- `PUT /api/admin/users/:id` - Cập nhật user
- `DELETE /api/admin/users/:id` - Xóa user

## Công nghệ Sử dụng

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Icons**: Font Awesome
- **Styling**: Custom CSS với responsive design

## Tính năng

✅ Đăng ký/Đăng nhập user
✅ Quản lý hồ sơ cá nhân
✅ Xem danh sách bác sĩ
✅ Đặt lịch khám
✅ Quản lý lịch hẹn
✅ Chatbot hỗ trợ
✅ Responsive design
✅ Admin panel
✅ Authentication & Authorization
✅ RESTful API

## License

ISC

Frontend được phục vụ trực tiếp từ backend server.

## Tài khoản Demo

### Admin
- Email: admin@bvquandany.com
- Password: 123456

### Bác sĩ
- Email: bs.nguyenvana@bvquandany.com
- Password: 123456

### Bệnh nhân
- Email: nguyenvana@example.com
- Password: 123456


### Cơ sở dữ liệu
- ✅ Indexes cho performance tối ưu
- ✅ Triggers tự động cập nhật timestamp
- ✅ Schema toàn diện với relationships

### Bảng chính:
- `users` - Thông tin người dùng
- `doctors` - Thông tin bác sĩ
- `specialties` - Chuyên khoa
- `departments` - Khoa phòng
- `appointments` - Lịch hẹn
- `medical_records` - Hồ sơ bệnh án
- `medications` - Thuốc
- `prescriptions` - Đơn thuốc
- `payments` - Thanh toán
- `insurance` - Bảo hiểm

### Quan hệ:
```
users (patient) ──── appointments ──── doctors
    │                       │
    └─── insurance          └─── medical_records
                              │
                              └─── prescriptions ──── medications
```

## API Endpoints

### Authentication
- `POST /login` - Đăng nhập
- `POST /signup` - Đăng ký
- `POST /verify-token` - Xác minh token

### Doctors
- `GET /doctors` - Lấy danh sách bác sĩ

### Appointments
- `POST /appointments` - Tạo lịch hẹn
- `GET /appointments/user/:user_id` - Lấy lịch hẹn theo user
- `GET /appointments/:phone` - Lấy lịch hẹn theo số điện thoại

### Users
- `GET /user/:id` - Lấy thông tin user

## Tính năng

### Cho Bệnh nhân:
- Đăng ký/Đăng nhập
- Đặt lịch khám
- Xem lịch khám đã đặt
- Xem hồ sơ cá nhân

### Cho Bác sĩ:
- Xem lịch hẹn
- Quản lý hồ sơ bệnh án
- Kê đơn thuốc

### Cho Admin:
- Quản lý người dùng
- Quản lý bác sĩ
- Quản lý chuyên khoa
- Báo cáo thống kê

## Phát triển thêm

### Thêm API mới:
1. Thêm route trong `server.js`
2. Cập nhật frontend tương ứng
3. Test kỹ lưỡng

### Mở rộng Database:
1. Thêm bảng mới trong `schema.sql`
2. Cập nhật `seed.sql` với dữ liệu mẫu
3. Chạy lại `npm run init-db`

## Troubleshooting

### Lỗi Database:
```bash
# Xóa database cũ và tạo mới
cd backend
rm database.db
npm run init-db
```

### Lỗi Port:
- Thay đổi port trong `server.js` nếu 3000 bị chiếm

### Lỗi Frontend:
- Đảm bảo backend đang chạy
- Kiểm tra console browser cho lỗi JavaScript
- Verify API endpoints match

## Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## License

MIT License