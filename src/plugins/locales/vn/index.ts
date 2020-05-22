import backend from "./backend";

export default {
  locale: "vi-VN",
  name: "Việt Nam",
  status: {
    error: "Lỗi",
    warning: "Cảnh báo",
    success: "Thành công",
    info: "Info",
  },
  header: {
    login: "Đăng Nhập",
    register: "Đăng Ký",
    my_assets: "Tài Sản",
    orders: "Giao Dịch",
    open_orders: "Lệnh Đang Mở",
    order_history: "Lịch Sử Lệnh",
    trade_history: "Lịch Sử Giao Dịch",
    user: {
      account_security: "Bảo Mật Tài Khoản",
      login_history: "Lịch Sử Đăng Nhập",
      logout: "Đăng Xuất",
    },
  },
  auth: {
    login: "Đăng Nhập",
    register: "Đăng Ký",
    confirm: "Xác Nhận",
    forgot_password: "Quên Mật Khẩu",
    no_account: "Chưa có tài khoản?",
    to_sign_up: "Đăng ký!",
  },
  history: {
    succeed: "thành công",
    failed: "thất bại",
    login: "Đăng nhập",
  },
  // Form placeholder
  placeholder: {
    "email": "Email",
    "password": "Mật khẩu",
    "repassword": "Nhập lại mật khẩu",
    "refid": "UID người giới thiệu",
    "2fa_code": "Mã OTP",
  },
  // Header table
  table: {
    "status": "Trạng thái",
    "name": "Tên",
    "date": "Ngày",
    "time": "Thời gian",
    "pair": "Cặp",
    "coin": "Tiền",
    "infomation": "Thông tin",
    "last_price": "Giá gần nhất",
    "price": "Giá",
    "market": "Thị trường",
    "change": "Thay đổi giá",
    "volume": "Khối lượng",
    "sum": "Tổng",
    "amount": "Số lượng",
    "total": "Tổng",
    "executed": "Đã thực hiện",
    "unexecuted": "Không được thực hiện",
    "avg_price": "Giá trung bình",
    "side": "Bên",
    "type": "Loại",
    "filled": "Đã khớp%",
    "24h_change": "Thay đổi giá 24h",
    "24h_high": "Giá cao nhất 24h",
    "24h_low": "Giá thấp nhất 24h",
    "24h_volume": "Khối lượng 24h",
    "ip_address": "Địa chỉ IP",
    "action": "Hành động",
    "available": "Số dư có sẵn",
    "locked": "Đang được đặt lệnh",
    "btc_val": "Giá trị BTC",
    "search": "Tìm kiếm",
  },
  action: {
    deposit: "Gửi tiền",
    withdrawal: "Rút tiền",
    exchange: "Giao dịch",
  },
  market_list: {
    favorite: "Yêu thích",
    market: "{market} Thị trường",
  },
  exchange: {
    card_head: {
      chart: "Đồ thị",
      market_trades: "Market Trades",
      open_orders: "Lệnh Đang Mở",
      history_orders: "Lịch Sử Lệnh",
      history_trades: "Lịch Sử Giao Dịch",
      limit_order: "Lệnh Giới Hạn",
    },
    status: {
      "change": "Thay đổi giá",
      "high": "Giá cao nhất",
      "low": "Giá thấp nhất",
      "24h_volume": "Khối lượng 24h",
    },
    entry: {
      price: "GIÁ",
      amount: "SL",
      total: "Tổng",
      sell: "Bán {currency}",
      buy: "Mua {currency}",
    },
    balance: {
      available: "Số dư có sẵn",
      locked: "Đang được đặt lệnh",
      unauth: "{0} hoặc {1} để giao dịch",
    },
  },
  assets: {
    address: "Địa chỉ",
    txid: "Txid",
    hidesmall: "Ẩn số dư mức nhỏ",
    total_assets_calc: "Ước tính",
    instructions: "Hãy lưu ý:",
    deposit: {
      deposit_address: "Địa chỉ nạp tiền:",
      copy: "Sao chép",
      qr_code: "Mã QR",
      note: `
        • Gửi ít nhất: {min_deposit_amount} {currency}
        {0}
        • Cần có ít nhất {min_confirmations} xác nhận để hoàn thành nạp tiền, chỉ gửi {currency} đến địa chỉ này. Gửi bất kỳ loại tiền nào khác đến địa chỉ này có thể dẫn đến mất tiền của bạn
        {0}
        • Vui lòng đảm bảo rằng máy tính và trình duyệt của bạn được an toàn và thông tin của bạn được bảo vệ khỏi bị giả mạo hoặc rò rỉ.
      `,
    },
    withdraw: {
      amount: "Amount",
      available: "Available:",
      fee: "Fee",
      receive_amount: "Receive Amount",
      note: `
        • Rút ít nhất: {min_withdraw_amount} {currency}.
        {0}
        •  Để đảm bảo an toàn cho tiền của bạn, yêu cầu rút tiền của bạn sẽ được xem xét thủ công nếu chiến lược bảo mật hoặc mật khẩu của bạn bị thay đổi. Xin vui lòng chờ các cuộc gọi điện thoại hoặc email từ nhân viên của chúng tôi.
        {0}
        • Vui lòng đảm bảo rằng máy tính và trình duyệt của bạn được an toàn và thông tin của bạn được bảo vệ khỏi bị giả mạo hoặc rò rỉ.
      `,
      submit: "Withdraw",
    },
    history: {
      state: {
        completed: "Hoàn Thành",
        processing: "Đang Xử Lý ({confirmations}/{min_confirmations})",
      },
    },
  },
  orders: {
    open: {
      title: "Lệnh Đang Mở",
      empty: "Bạn không có lệnh nào đang mở",
    },
    history: {
      title: "Lịch Sử Lệnh",
      empty: "Bạn chưa có bất cứ lệnh nào nào",
    },
    transaction: {
      title: "Lịch Sử Giao Dịch",
      empty: "Bạn chưa có bất cứ giao dịch nào",
    },
    empty_second: "Di chuyển đến tab Lệnh và đặt lệnh!",
  },
  usercenter: {
    account_information: {
      title: "Thông Tin Tài Khoản",
      rows: {
        email: {
          name: "Email",
          desc:
            "Dùng để xác minh rút tiền, khôi phục mật khẩu, chỉnh sửa cài đặt và hoạt động khác.",
        },
      },
    },
    account_security: {
      title: "Bảo Mật Tài Khoản",
      rows: {
        psw: {
          name: "Mật Khẩu Đăng Nhập",
          desc: `Dùng để đăng nhập.`,
          action: "Đổi mật khẩu",
        },
        otp: {
          name: "Xác Thực Google Authenticator",
          desc: `Khuyến khích sử dụng để rút tiền & điều chỉnh cài đặt mật khẩu và bảo mật.`,
          action: "Cài đặt",
        },
      },
    },
    login_history: {
      title: "Lịch sử đăng nhập",
    },
  },
  ...backend,
};
