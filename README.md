# WebHopital - Hệ thống Bệnh viện Trực tuyến

**Static Site Version** - Hospital Management System

## ✨ Tính năng

- 📋 Danh sách bác sĩ chuyên khoa
- 🏥 Đặt lịch khám nhanh chóng  
- 👤 Quản lý thông tin bệnh nhân
- 💬 Chatbot hỗ trợ bệnh nhân
- 📱 Giao diện responsive

## 🚀 Truy cập Trực tiếp

Truy cập trang web: **[https://luwxbin-bit.github.io/webhopital](https://luwxbin-bit.github.io/webhopital)**

## 📖 Hướng dẫn Sử dụng

### Đăng nhập / Đăng ký
- Truy cập trang **Login** hoặc **Sign Up**
- Nhập thông tin và đăng nhập
- Dữ liệu được lưu trên thiết bị (localStorage)

### Đặt lịch khám
1. Vào trang **Đặt lịch khám**
2. Chọn bác sĩ, ngày, giờ mong muốn
3. Nhập thông tin liên lạc
4. Xác nhận - Lịch hẹn được lưu trên thiết bị

### Xem lịch hẹn
- Vào **Lịch hẹn của tôi** để xem tất cả lịch khám
- Dữ liệu được lưu cục bộ trên browser

## 🛠️ Công nghệ

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Lưu trữ**: localStorage (Browser)
- **Hosting**: GitHub Pages
- **Icons**: Font Awesome

## 📁 Cấu trúc Dự án

## Tài khoản Demo

Sau khi khởi tạo database, bạn có thể đăng nhập với các tài khoản sau:

### Admin
- Email: `admin@bvquandany.com`
- Password: `123456`

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