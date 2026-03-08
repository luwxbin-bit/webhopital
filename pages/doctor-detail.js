/**
 * Doctor Detail Page JavaScript
 * Hiển thị thông tin chi tiết của bác sĩ
 */

// Global variables
let currentDoctor = null;
let currentWeekStart = new Date();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get doctor ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = parseInt(urlParams.get('id'));

    if (!doctorId) {
        window.location.href = 'doctors.html';
        return;
    }

    // Load doctor data
    loadDoctorDetail(doctorId);
    setupEventListeners();
    updateUserInterface();
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // Schedule navigation
    document.getElementById('prevWeek').addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        loadSchedule();
    });

    document.getElementById('nextWeek').addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        loadSchedule();
    });

    // Book appointment
    document.getElementById('bookAppointmentBtn').addEventListener('click', function() {
        if (!AuthModule.getCurrentUser()) {
            window.location.href = 'login.html';
            return;
        }
        window.location.href = `booking.html?doctor=${currentDoctor.id}`;
    });

    // Call button
    document.getElementById('callBtn').addEventListener('click', function() {
        alert('Số điện thoại: 1900-XXXX\nGiờ làm việc: 8:00 - 17:00');
    });

    // Login/Signup buttons
    document.getElementById('loginBtn').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    document.getElementById('signupBtn').addEventListener('click', function() {
        window.location.href = 'signup.html';
    });

    // Logout
    document.getElementById('logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        AuthModule.logout();
        location.reload();
    });

    // Review form
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview();
    });

    // Review stars
    document.querySelectorAll('#reviewStars i').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setReviewRating(rating);
        });
    });
}

// Load doctor detail
function loadDoctorDetail(doctorId) {
    // Find doctor from demo doctors or custom doctors
    const customDoctors = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]');
    currentDoctor = [...DEMO_DOCTORS, ...customDoctors].find(d => d.id === doctorId);

    if (!currentDoctor) {
        alert('Không tìm thấy thông tin bác sĩ!');
        window.location.href = 'doctors.html';
        return;
    }

    // Update page title
    document.title = `${currentDoctor.name} - ${currentDoctor.specialty} | WebHopital`;

    // Load basic info
    loadDoctorBasicInfo();
    loadDoctorOverview();
    loadSchedule();
    loadReviews();
    loadEducation();
    loadRelatedDoctors();
}

// Load basic doctor information
function loadDoctorBasicInfo() {
    document.getElementById('doctorName').textContent = currentDoctor.name;
    document.getElementById('doctorSpecialty').textContent = currentDoctor.specialty;
    document.getElementById('doctorHospital').textContent = currentDoctor.hospital;
    document.getElementById('doctorExperience').textContent = currentDoctor.experience;

    // Rating stars
    const starsContainer = document.getElementById('doctorStars');
    const rating = currentDoctor.rating || 4.5;
    starsContainer.innerHTML = generateStars(rating);
    document.getElementById('doctorRating').textContent = rating.toFixed(1);
}

// Load doctor overview
function loadDoctorOverview() {
    // Bio
    const bio = getDoctorBio(currentDoctor);
    document.getElementById('doctorBio').textContent = bio;

    // Specialties
    const specialtiesContainer = document.getElementById('doctorSpecialties');
    specialtiesContainer.innerHTML = `
        <span class="specialty-tag">${currentDoctor.specialty}</span>
        <span class="specialty-tag">Nội khoa</span>
        <span class="specialty-tag">Tim mạch</span>
    `;

    // Experience timeline
    const experienceContainer = document.getElementById('doctorExperienceTimeline');
    experienceContainer.innerHTML = `
        <div class="timeline-item">
            <div class="timeline-date">2015 - Hiện tại</div>
            <div class="timeline-content">
                <h4>Bác sĩ chuyên khoa ${currentDoctor.specialty}</h4>
                <p>${currentDoctor.hospital}</p>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-date">2010 - 2015</div>
            <div class="timeline-content">
                <h4>Bác sĩ nội trú</h4>
                <p>Bệnh viện Đại học Y Dược TP.HCM</p>
            </div>
        </div>
    `;

    // Certificates
    const certificatesContainer = document.getElementById('doctorCertificates');
    certificatesContainer.innerHTML = `
        <div class="certificate-item">
            <i class="fas fa-certificate"></i>
            <div>
                <h5>Giấy phép hành nghề</h5>
                <p>Số: ${generateRandomNumber()}</p>
            </div>
        </div>
        <div class="certificate-item">
            <i class="fas fa-certificate"></i>
            <div>
                <h5>Chứng chỉ chuyên khoa ${currentDoctor.specialty}</h5>
                <p>Cấp bởi Bộ Y tế Việt Nam</p>
            </div>
        </div>
    `;
}

// Load schedule
function loadSchedule() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const weekDates = getWeekDates(currentWeekStart);

    // Update week display
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    document.getElementById('currentWeek').textContent =
        `${formatDate(currentWeekStart)} - ${formatDate(weekEnd)}`;

    // Generate schedule grid
    let html = '<div class="schedule-header">';
    html += '<div class="time-slot">Giờ</div>';

    weekDates.forEach(date => {
        const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
        const dayDate = date.getDate();
        const isToday = isSameDate(date, new Date());
        html += `<div class="day-slot ${isToday ? 'today' : ''}">${dayName}<br>${dayDate}</div>`;
    });

    html += '</div>';

    // Time slots
    CONSTANTS.TIME_SLOTS.forEach(time => {
        html += '<div class="schedule-row">';
        html += `<div class="time-slot">${time}</div>`;

        weekDates.forEach(date => {
            const available = isTimeSlotAvailable(currentDoctor.id, date, time);
            const isPast = date < new Date() && !isSameDate(date, new Date());

            html += `<div class="time-slot-cell ${available && !isPast ? 'available' : 'unavailable'} ${isPast ? 'past' : ''}" data-date="${formatDateISO(date)}" data-time="${time}">`;
            if (available && !isPast) {
                html += '<i class="fas fa-check"></i>';
            } else if (isPast) {
                html += '<i class="fas fa-clock"></i>';
            } else {
                html += '<i class="fas fa-times"></i>';
            }
            html += '</div>';
        });

        html += '</div>';
    });

    scheduleGrid.innerHTML = html;

    // Add click handlers for available slots
    document.querySelectorAll('.time-slot-cell.available').forEach(cell => {
        cell.addEventListener('click', function() {
            const date = this.dataset.date;
            const time = this.dataset.time;
            if (confirm(`Đặt lịch khám vào ${formatDate(date)} lúc ${time}?`)) {
                if (!AuthModule.getCurrentUser()) {
                    window.location.href = 'login.html';
                    return;
                }
                window.location.href = `booking.html?doctor=${currentDoctor.id}&date=${date}&time=${time}`;
            }
        });
    });
}

// Load reviews
function loadReviews() {
    // Mock reviews data
    const reviews = generateMockReviews(currentDoctor.id);

    // Overall rating
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    document.getElementById('overallStars').innerHTML = generateStars(avgRating);
    document.getElementById('overallRating').textContent = avgRating.toFixed(1);
    document.getElementById('totalReviews').textContent = `(${reviews.length} đánh giá)`;

    // Rating breakdown
    const breakdown = getRatingBreakdown(reviews);
    const breakdownContainer = document.getElementById('ratingBreakdown');
    breakdownContainer.innerHTML = Object.entries(breakdown)
        .sort(([a], [b]) => b - a)
        .map(([rating, count]) => `
            <div class="rating-bar">
                <span>${rating} ⭐</span>
                <div class="bar">
                    <div class="fill" style="width: ${(count / reviews.length) * 100}%"></div>
                </div>
                <span>${count}</span>
            </div>
        `).join('');

    // Reviews list
    const reviewsContainer = document.getElementById('reviewsList');
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="../images/avatar-placeholder.png" alt="${review.author}" class="reviewer-avatar">
                    <div>
                        <h5>${review.author}</h5>
                        <div class="review-stars">${generateStars(review.rating)}</div>
                    </div>
                </div>
                <div class="review-date">${formatDate(review.date)}</div>
            </div>
            <h4>${review.title}</h4>
            <p>${review.content}</p>
            ${review.helpful ? `<div class="review-helpful"><i class="fas fa-thumbs-up"></i> ${review.helpful} người thấy hữu ích</div>` : ''}
        </div>
    `).join('');

    // Show/hide review form based on authentication
    const user = AuthModule.getCurrentUser();
    const reviewSection = document.getElementById('writeReviewSection');
    if (user) {
        reviewSection.style.display = 'block';
    } else {
        reviewSection.style.display = 'none';
    }
}

// Load education
function loadEducation() {
    const educationContainer = document.getElementById('educationTimeline');
    educationContainer.innerHTML = `
        <div class="timeline-item">
            <div class="timeline-date">2005 - 2010</div>
            <div class="timeline-content">
                <h4>Đại học Y Dược TP.HCM</h4>
                <p>Bác sĩ đa khoa</p>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-date">2010 - 2012</div>
            <div class="timeline-content">
                <h4>Chuyên khoa ${currentDoctor.specialty}</h4>
                <p>Bệnh viện Chợ Rẫy</p>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-date">2018</div>
            <div class="timeline-content">
                <h4>Học bổng đào tạo tại Singapore</h4>
                <p>National University Hospital</p>
            </div>
        </div>
    `;

    const certificatesContainer = document.getElementById('certificatesGrid');
    certificatesContainer.innerHTML = `
        <div class="certificate-card">
            <i class="fas fa-graduation-cap"></i>
            <h5>Bác sĩ đa khoa</h5>
            <p>Đại học Y Dược TP.HCM</p>
        </div>
        <div class="certificate-card">
            <i class="fas fa-certificate"></i>
            <h5>Chuyên khoa ${currentDoctor.specialty}</h5>
            <p>Bộ Y tế Việt Nam</p>
        </div>
        <div class="certificate-card">
            <i class="fas fa-award"></i>
            <h5>BLS/ACLS</h5>
            <p>Hiệp hội Tim mạch Mỹ</p>
        </div>
    `;
}

// Load related doctors
function loadRelatedDoctors() {
    const relatedDoctors = DoctorModule.getAll()
        .filter(d => d.id !== currentDoctor.id && d.specialty === currentDoctor.specialty)
        .slice(0, 3);

    const container = document.getElementById('relatedDoctors');
    container.innerHTML = relatedDoctors.map(doctor => `
        <div class="doctor-card">
            <img src="../images/avatar-placeholder.png" alt="${doctor.name}">
            <div class="doctor-card-info">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty}</p>
                <div class="rating">
                    ${generateStars(doctor.rating)}
                    <span>${doctor.rating}</span>
                </div>
                <a href="doctor-detail.html?id=${doctor.id}" class="btn btn-sm btn-outline">Xem chi tiết</a>
            </div>
        </div>
    `).join('');
}

// Switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Submit review
function submitReview() {
    const rating = getSelectedRating();
    const title = document.getElementById('reviewTitle').value;
    const content = document.getElementById('reviewContent').value;

    if (!rating || !title || !content) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // Save review (mock implementation)
    const review = {
        id: Date.now(),
        doctorId: currentDoctor.id,
        author: AuthModule.getCurrentUser().name,
        rating: rating,
        title: title,
        content: content,
        date: new Date().toISOString(),
        helpful: 0
    };

    // In real implementation, this would be saved to backend
    console.log('Review submitted:', review);

    // Reset form
    document.getElementById('reviewForm').reset();
    setReviewRating(0);

    // Reload reviews
    loadReviews();

    NotificationModule.add({
        type: CONSTANTS.NOTIFICATION_TYPES.SYSTEM,
        title: 'Đánh giá thành công',
        message: 'Cảm ơn bạn đã đánh giá bác sĩ!',
        timestamp: new Date().toISOString()
    });
}

// Utility functions
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

function getDoctorBio(doctor) {
    const bios = {
        'Tim mạch': `${doctor.name} là bác sĩ chuyên khoa Tim mạch với hơn ${doctor.experience} kinh nghiệm. Bác sĩ đã thực hiện thành công hàng nghìn ca phẫu thuật tim mạch và được bệnh nhân tin tưởng.`,
        'Tai mũi họng': `${doctor.name} là chuyên gia hàng đầu về Tai mũi họng với chuyên môn sâu về phẫu thuật nội soi và điều trị các bệnh lý đường hô hấp.`,
        'Nội tổng quát': `${doctor.name} có kinh nghiệm phong phú trong chẩn đoán và điều trị các bệnh lý nội khoa, đặc biệt là các bệnh mạn tính.`,
        'Phụ khoa': `${doctor.name} là bác sĩ Phụ khoa tận tâm, chuyên điều trị các bệnh lý phụ nữ và chăm sóc sức khỏe sinh sản.`,
        'Nhi khoa': `${doctor.name} có tình yêu đặc biệt với trẻ em và dày dặn kinh nghiệm trong việc chăm sóc sức khỏe trẻ em.`,
        'Chỉnh hình': `${doctor.name} là chuyên gia chỉnh hình với kỹ thuật phẫu thuật tiên tiến và tỷ lệ thành công cao.`,
        'Da liễu': `${doctor.name} chuyên điều trị các bệnh lý da liễu và thẩm mỹ da hiện đại.`
    };

    return bios[doctor.specialty] || `${doctor.name} là bác sĩ chuyên khoa ${doctor.specialty} với nhiều năm kinh nghiệm tại ${doctor.hospital}.`;
}

function getWeekDates(startDate) {
    const dates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date);
    }

    return dates;
}

function isTimeSlotAvailable(doctorId, date, time) {
    // Check if slot is already booked
    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    const isBooked = appointments.some(apt =>
        apt.doctorId === doctorId &&
        apt.date === formatDateISO(date) &&
        apt.time === time &&
        apt.status !== CONSTANTS.APPOINTMENT_STATUS.CANCELLED
    );

    return !isBooked;
}

function isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

function generateMockReviews(doctorId) {
    const reviewTemplates = [
        { title: 'Bác sĩ rất tận tâm', content: 'Bác sĩ khám rất kỹ lưỡng và tư vấn chi tiết. Rất hài lòng với dịch vụ.', rating: 5 },
        { title: 'Khám chuyên nghiệp', content: 'Thời gian chờ không lâu, bác sĩ giải thích rõ ràng về tình trạng bệnh.', rating: 4 },
        { title: 'Dịch vụ tốt', content: 'Phòng khám sạch sẽ, nhân viên thân thiện. Bác sĩ có chuyên môn cao.', rating: 5 },
        { title: 'Hài lòng', content: 'Được khám đúng hẹn, bác sĩ chẩn đoán chính xác và kê đơn phù hợp.', rating: 4 },
        { title: 'Rất tin tưởng', content: 'Đã khám nhiều lần và luôn hài lòng với cách điều trị của bác sĩ.', rating: 5 }
    ];

    const reviews = [];
    const numReviews = Math.floor(Math.random() * 8) + 3; // 3-10 reviews

    for (let i = 0; i < numReviews; i++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        reviews.push({
            id: i + 1,
            author: `Bệnh nhân ${i + 1}`,
            ...template,
            date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: Math.floor(Math.random() * 10)
        });
    }

    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getRatingBreakdown(reviews) {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
        breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    });
    return breakdown;
}

function setReviewRating(rating) {
    document.querySelectorAll('#reviewStars i').forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

function getSelectedRating() {
    let rating = 0;
    document.querySelectorAll('#reviewStars i').forEach((star, index) => {
        if (star.className.includes('fas')) {
            rating = index + 1;
        }
    });
    return rating;
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
}

function updateUserInterface() {
    const user = AuthModule.getCurrentUser();
    const userSection = document.getElementById('userSection');
    const userLoggedIn = document.getElementById('userLoggedIn');

    if (user) {
        userSection.style.display = 'none';
        userLoggedIn.style.display = 'flex';
        document.getElementById('userName').textContent = user.name;
    } else {
        userSection.style.display = 'flex';
        userLoggedIn.style.display = 'none';
    }
}