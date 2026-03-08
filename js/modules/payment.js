/**
 * PaymentModule - Hệ thống thanh toán tích hợp
 * Hỗ trợ VNPay, Momo, và các phương thức thanh toán khác
 */

class PaymentModule {
  constructor() {
    this.providers = {
      VNPAY: 'vnpay',
      MOMO: 'momo',
      ZALOPAY: 'zalopay',
      BANK_TRANSFER: 'bank_transfer'
    };

    this.currentProvider = this.providers.VNPAY;

    // VNPay configuration (replace with your actual config)
    this.vnpayConfig = {
      tmnCode: 'your_tmn_code',
      hashSecret: 'your_hash_secret',
      url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      returnUrl: window.location.origin + '/pages/payment-result.html'
    };

    // Mock payment data for development
    this.mockMode = true;
  }

  /**
   * Khởi tạo thanh toán
   */
  async initializePayment(appointment, amount, description = '') {
    if (this.mockMode) {
      return this.mockPayment(appointment, amount, description);
    }

    switch (this.currentProvider) {
      case this.providers.VNPAY:
        return this.initializeVNPay(appointment, amount, description);
      case this.providers.MOMO:
        return this.initializeMomo(appointment, amount, description);
      default:
        throw new Error('Unsupported payment provider');
    }
  }

  /**
   * Mock payment for development
   */
  async mockPayment(appointment, amount, description) {
    console.log('💳 MOCK PAYMENT INITIALIZED:');
    console.log('Appointment ID:', appointment.id);
    console.log('Amount:', amount);
    console.log('Description:', description);

    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          resolve({
            success: true,
            transactionId: 'MOCK_' + Date.now(),
            paymentUrl: null, // Direct success
            message: 'Payment successful (Mock)'
          });
        } else {
          resolve({
            success: false,
            error: 'Payment failed (Mock)',
            message: 'Thanh toán thất bại. Vui lòng thử lại.'
          });
        }
      }, 2000); // 2 second delay
    });
  }

  /**
   * Khởi tạo thanh toán VNPay
   */
  async initializeVNPay(appointment, amount, description) {
    try {
      const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.vnpayConfig.tmnCode,
        vnp_Amount: amount * 100, // VNPay expects amount in smallest currency unit
        vnp_CurrCode: 'VND',
        vnp_TxnRef: appointment.id.toString(),
        vnp_OrderInfo: description || `Thanh toan lich hen ${appointment.id}`,
        vnp_OrderType: 'medical',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: this.vnpayConfig.returnUrl,
        vnp_IpAddr: this.getClientIP(),
        vnp_CreateDate: this.formatVNPayDate(new Date())
      };

      // Add secure hash
      vnpParams.vnp_SecureHash = this.generateVNPaySecureHash(vnpParams);

      // Build payment URL
      const paymentUrl = this.buildVNPayUrl(vnpParams);

      return {
        success: true,
        paymentUrl: paymentUrl,
        transactionId: vnpParams.vnp_TxnRef,
        provider: 'VNPay'
      };

    } catch (error) {
      console.error('VNPay initialization failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Không thể khởi tạo thanh toán VNPay'
      };
    }
  }

  /**
   * Khởi tạo thanh toán Momo
   */
  async initializeMomo(appointment, amount, description) {
    // Mock Momo implementation
    console.log('Momo payment not fully implemented yet');
    return this.mockPayment(appointment, amount, description);
  }

  /**
   * Xử lý kết quả thanh toán
   */
  processPaymentResult(queryParams) {
    if (this.mockMode) {
      return this.processMockPaymentResult(queryParams);
    }

    switch (this.currentProvider) {
      case this.providers.VNPAY:
        return this.processVNPayResult(queryParams);
      default:
        return { success: false, error: 'Unknown payment provider' };
    }
  }

  /**
   * Xử lý kết quả mock payment
   */
  processMockPaymentResult(params) {
    const success = params.get('success') === 'true';
    const transactionId = params.get('transactionId');

    return {
      success: success,
      transactionId: transactionId,
      message: success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!',
      amount: params.get('amount'),
      appointmentId: params.get('appointmentId')
    };
  }

  /**
   * Xử lý kết quả VNPay
   */
  processVNPayResult(queryParams) {
    const vnpParams = {};
    for (let [key, value] of queryParams.entries()) {
      if (key.startsWith('vnp_')) {
        vnpParams[key] = value;
      }
    }

    // Verify secure hash
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;

    const calculatedHash = this.generateVNPaySecureHash(vnpParams);

    if (secureHash !== calculatedHash) {
      return {
        success: false,
        error: 'Invalid secure hash',
        message: 'Mã bảo mật không hợp lệ'
      };
    }

    const success = vnpParams.vnp_ResponseCode === '00';
    const transactionId = vnpParams.vnp_TxnRef;
    const amount = parseInt(vnpParams.vnp_Amount) / 100;

    return {
      success: success,
      transactionId: transactionId,
      amount: amount,
      appointmentId: vnpParams.vnp_TxnRef,
      message: success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!',
      vnpayCode: vnpParams.vnp_ResponseCode
    };
  }

  /**
   * Tính phí khám bệnh
   */
  calculateAppointmentFee(appointment, doctor) {
    // Base fee by specialty
    const baseFees = {
      'Tim mạch': 500000,
      'Tai mũi họng': 300000,
      'Nội tổng quát': 250000,
      'Phụ khoa': 350000,
      'Nhi khoa': 300000,
      'Chỉnh hình': 400000,
      'Da liễu': 280000,
      'Mắt': 320000,
      'Nha khoa': 200000,
      'Tâm thần': 450000
    };

    const baseFee = baseFees[doctor.specialty] || 300000;

    // Additional fees
    let totalFee = baseFee;

    // Urgent appointment fee
    if (appointment.isUrgent) {
      totalFee += 100000;
    }

    // Weekend fee
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate.getDay() === 0 || appointmentDate.getDay() === 6) {
      totalFee += 50000;
    }

    // Doctor experience bonus
    const experienceYears = parseInt(doctor.experience) || 0;
    if (experienceYears > 10) {
      totalFee += 50000;
    }

    return totalFee;
  }

  /**
   * Lấy thông tin thanh toán của lịch hẹn
   */
  getAppointmentPaymentInfo(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    const appointment = appointments.find(a => a.id === appointmentId);

    if (!appointment) return null;

    const doctor = [...DEMO_DOCTORS, ...JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]')]
      .find(d => d.id === appointment.doctorId);

    if (!doctor) return null;

    const fee = this.calculateAppointmentFee(appointment, doctor);

    return {
      appointmentId: appointment.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: appointment.date,
      time: appointment.time,
      fee: fee,
      isPaid: appointment.isPaid || false,
      paymentDate: appointment.paymentDate,
      transactionId: appointment.transactionId
    };
  }

  /**
   * Đánh dấu thanh toán thành công
   */
  markPaymentSuccessful(appointmentId, transactionId, amount) {
    const appointments = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.APPOINTMENTS) || '[]');
    const index = appointments.findIndex(a => a.id === appointmentId);

    if (index !== -1) {
      appointments[index].isPaid = true;
      appointments[index].paymentDate = new Date().toISOString();
      appointments[index].transactionId = transactionId;
      appointments[index].paidAmount = amount;

      localStorage.setItem(CONSTANTS.STORAGE.APPOINTMENTS, JSON.stringify(appointments));

      // Send confirmation email
      const appointment = appointments[index];
      const patient = JSON.parse(localStorage.getItem('webhopital_users') || '[]')
        .find(u => u.id === appointment.patientId);
      const doctor = [...DEMO_DOCTORS, ...JSON.parse(localStorage.getItem(CONSTANTS.STORAGE.DOCTORS) || '[]')]
        .find(d => d.id === appointment.doctorId);

      if (patient && doctor) {
        EmailModule.sendAppointmentConfirmation(appointment, patient, doctor);
      }

      return true;
    }

    return false;
  }

  // VNPay utility methods
  formatVNPayDate(date) {
    return date.getFullYear() +
           ('0' + (date.getMonth() + 1)).slice(-2) +
           ('0' + date.getDate()).slice(-2) +
           ('0' + date.getHours()).slice(-2) +
           ('0' + date.getMinutes()).slice(-2) +
           ('0' + date.getSeconds()).slice(-2);
  }

  generateVNPaySecureHash(params) {
    // Sort parameters
    const sortedKeys = Object.keys(params).sort();
    let hashData = '';

    sortedKeys.forEach(key => {
      if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
        hashData += key + '=' + params[key] + '&';
      }
    });

    hashData = hashData.slice(0, -1); // Remove last &
    hashData += this.vnpayConfig.hashSecret;

    // In real implementation, use proper HMAC-SHA512
    // For demo, return a mock hash
    return btoa(hashData).substring(0, 32);
  }

  buildVNPayUrl(params) {
    let url = this.vnpayConfig.url + '?';
    Object.keys(params).forEach(key => {
      url += key + '=' + encodeURIComponent(params[key]) + '&';
    });
    return url.slice(0, -1); // Remove last &
  }

  getClientIP() {
    // In real implementation, get from server
    return '127.0.0.1';
  }

  /**
   * Lấy danh sách phương thức thanh toán
   */
  getPaymentMethods() {
    return [
      { id: this.providers.VNPAY, name: 'VNPay', icon: 'fas fa-credit-card' },
      { id: this.providers.MOMO, name: 'MoMo', icon: 'fas fa-wallet' },
      { id: this.providers.ZALOPAY, name: 'ZaloPay', icon: 'fas fa-mobile-alt' },
      { id: this.providers.BANK_TRANSFER, name: 'Chuyển khoản', icon: 'fas fa-university' }
    ];
  }

  /**
   * Đặt phương thức thanh toán mặc định
   */
  setPaymentProvider(provider) {
    if (Object.values(this.providers).includes(provider)) {
      this.currentProvider = provider;
      return true;
    }
    return false;
  }
}

// Khởi tạo module
const PaymentModule = new PaymentModule();

// Export cho global scope
window.PaymentModule = PaymentModule;