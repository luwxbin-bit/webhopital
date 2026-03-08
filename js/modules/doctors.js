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
  }
};
