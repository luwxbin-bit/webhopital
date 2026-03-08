/**
 * DOCTORS MODULE - Quản lý danh sách bác sĩ
 */

const DoctorModule = {
  doctors: DEMO_DOCTORS,

  /**
   * Lấy tất cả bác sĩ
   */
  getAll() {
    return this.doctors;
  },

  /**
   * Lấy bác sĩ theo ID
   */
  getById(id) {
    return this.doctors.find(d => d.id == id);
  },

  /**
   * Lọc bác sĩ theo chuyên khoa
   */
  filterBySpecialty(specialty) {
    if (!specialty) return this.doctors;
    return this.doctors.filter(d => d.specialty === specialty);
  },

  /**
   * Tìm kiếm bác sĩ
   */
  search(query) {
    if (!query) return this.doctors;
    query = query.toLowerCase();
    return this.doctors.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.specialty.toLowerCase().includes(query) ||
      d.hospital.toLowerCase().includes(query)
    );
  },

  /**
   * Lấy danh sách chuyên khoa
   */
  getSpecialties() {
    return CONSTANTS.SPECIALTIES;
  },

  /**
   * Lấy bác sĩ theo chuyên khoa (nhóm)
   */
  groupBySpecialty() {
    const grouped = {};
    this.doctors.forEach(doctor => {
      if (!grouped[doctor.specialty]) {
        grouped[doctor.specialty] = [];
      }
      grouped[doctor.specialty].push(doctor);
    });
    return grouped;
  },

  /**
   * Sắp xếp bác sĩ theo rating
   */
  sortByRating() {
    return [...this.doctors].sort((a, b) => b.rating - a.rating);
  },

  /**
   * Lấy bác sĩ nổi bật (top 6)
   */
  getFeatured() {
    return this.sortByRating().slice(0, 6);
  },

  /**
   * Kiểm tra lịch trống
   */
  getAvailableSlots(doctorId, date) {
    // Lấy các lịch đã đặt
    const appointments = AppointmentStorage.getAll();
    const bookedSlots = appointments
      .filter(a => a.doctorId == doctorId && a.date === date && a.status !== CONSTANTS.APPOINTMENT_STATUS.CANCELLED)
      .map(a => a.time);

    // Trả về các slot trống
    return CONSTANTS.TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
  },

  /**
   * Lấy danh sách ngày có slot trống
   */
  getAvailableDates(doctorId, days = 30) {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Bỏ qua chủ nhật
      if (date.getDay() === 0) continue;

      const dateStr = date.toISOString().split('T')[0];
      const slots = this.getAvailableSlots(doctorId, dateStr);

      if (slots.length > 0) {
        dates.push({
          date: dateStr,
          dayOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()],
          dayOfMonth: date.getDate(),
          month: date.getMonth() + 1,
          availableCount: slots.length
        });
      }
    }

    return dates;
  },

  /**
   * Render danh sách bác sĩ với animation
   */
  renderDoctors(doctors, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { 
      showBookingButton = true, 
      maxItems = null,
      animate = true 
    } = options;

    // Giới hạn số lượng nếu cần
    const displayDoctors = maxItems ? doctors.slice(0, maxItems) : doctors;

    // Clear container
    container.innerHTML = '';

    // Render từng bác sĩ với animation
    displayDoctors.forEach((doctor, index) => {
      const doctorCard = this.createDoctorCard(doctor, showBookingButton);
      
      if (animate) {
        doctorCard.style.opacity = '0';
        doctorCard.style.transform = 'translateY(30px)';
        doctorCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      container.appendChild(doctorCard);

      // Animate card xuất hiện
      if (animate) {
        setTimeout(() => {
          doctorCard.style.opacity = '1';
          doctorCard.style.transform = 'translateY(0)';
        }, index * 150);
      }
    });
  },

  /**
   * Tạo card bác sĩ
   */
  createDoctorCard(doctor, showBookingButton = true) {
    const card = document.createElement('div');
    card.className = 'doctor-card hover-lift';
    card.setAttribute('data-doctor-id', doctor.id);

    card.innerHTML = `
      <div class="doctor-avatar">
        <i class="fas fa-user-md animate-pulse"></i>
      </div>
      <h3>${doctor.name}</h3>
      <p class="specialty"><i class="fas fa-stethoscope"></i> ${doctor.specialty}</p>
      <p class="hospital"><i class="fas fa-hospital"></i> ${doctor.hospital}</p>
      <div class="doctor-rating">
        <i class="fas fa-star"></i>
        <span>${doctor.rating || 4.5}</span>
        <span class="rating-count">(${doctor.reviewCount || 0} đánh giá)</span>
      </div>
      ${showBookingButton ? `
        <button class="btn btn-primary book-doctor-btn hover-scale" data-doctor-id="${doctor.id}">
          <i class="fas fa-calendar-check"></i> Đặt lịch khám
        </button>
      ` : ''}
    `;

    // Thêm event listener cho nút đặt lịch
    if (showBookingButton) {
      const bookBtn = card.querySelector('.book-doctor-btn');
      bookBtn.addEventListener('click', () => {
        this.bookDoctor(doctor.id);
      });
    }

    return card;
  },

  /**
   * Đặt lịch với bác sĩ
   */
  bookDoctor(doctorId) {
    const doctor = this.getById(doctorId);
    if (!doctor) return;

    // Lưu thông tin bác sĩ đã chọn
    sessionStorage.setItem('selectedDoctor', JSON.stringify(doctor));
    
    // Chuyển đến trang đặt lịch
    window.location.href = 'pages/booking.html';
  }
};
