export default {
  //Auth Message
  "resource.labels.private": "Can't update label",
  "resource.user.no_activity": "Không có hoạt động ghi lại hoặc sai chủ đề",
  "resource.profile.not_exist": "Người dùng không có hồ sơ",
  "resource.profile.exist": "Hồ sơ đã tồn tại",
  "resource.api_key.2fa_disabled":
    "Chỉ những tài khoản được kích hoạt 2FA mới được phép truy cập",
  "resource.api_key.missing_otp":
    "Tài khoản đã kích hoạt 2FA nhưng thiếu mã OTP",
  "resource.api_key.invalid_otp": "Mã OTP không hợp lệ",
  "resource.phone.twillio": "Có gì đó không ổn với Twilio Client",
  "resource.phone.invalid_num": "Số điện thoại không hợp lệ",
  "resource.phone.exists": "Số điện thoại đã tồn tại",
  "resource.phone.number_exist": "Số điện thoại đã tồn tại",
  "resource.phone.verification_invalid":
    "Không tìm thấy điện thoại hoặc mã xác minh không hợp lệ",
  "resource.documents.limit_reached":
    "Số lượng tài liệu đã đạt đến giới hạn 10/10",
  "resource.documents.limit_will_be_reached":
    "Số lượng tài liệu sẽ đạt đến giới hạn bởi tải lên này",
  "resource.otp.already_enabled": "2FA đã được kích hoạt cho tài khoản này",
  "resource.otp.invalid": "Mã OTP không hợp lệ",
  "resource.password.doesnt_match": "Mật khẩu mới không khớp",
  "resource.password.prev_pass_not_correct": "Mật khẩu trước đây không đúng",
  "resource.password.no_change_provided":
    "Mật khẩu mới và mật khẩu cũ không được giống nhau",
  "resource.document.empty_doc_expire": "Ngày hết hạn không hợp lệ",
  "password.requirements": "Mật khẩu không đáp ứng các yêu cầu tối thiểu",
  "password.password.password_strength": "Mật khẩu quá yếu",

  "email.taken": "Email đã được sử dụng",

  "identity.user.invalid_referral_format": "UID giới thiệu không hợp lệ",
  "identity.user.referral_doesnt_exist": "Giới thiệu không tồn tại",
  "identity.user.active_or_doesnt_exist":
    "Người dùng không tồn tại hoặc đã được kích hoạt",
  "identity.password.user_doesnt_exist": "Người dùng không tồn tại",
  "identity.user.passwords_doesnt_match": "Mật khẩu không hợp lệ",
  "identity.user.utilized_token": "JWT đã được sử dụng",
  "identity.session.invalid_login_params": "Email hoặc mật khẩu không hợp lệ",
  "identity.session.invalid": "Phiên bản hết hạn",
  "identity.captcha.required": "captcha_response là bắt buộc",
  "identity.captcha.mandatory_fields": "Các phần bắt buộc phải được điền vào",
  "identity.session.not_active": "Tài khoản của bạn chưa được kích hoạt",
  "identity.session.banned": "Tài khoản của bạn đã bị khóa",
  "identity.session.invalid_params": "Email hoặc mật khẩu không hợp lệ",
  "identity.session.missing_otp":
    "Tài khoản đã kích hoạt 2FA nhưng thiếu mã OTP",
  "identity.session.invalid_otp": "Mã OTP không hợp lệ",

  "first_name.invalid": "Họ không hợp lệ",
  "last_name.invalid": "Tên không hợp lệ",
  "city.invalid": "Thành phố không hợp lệ",
  "postcode.invalid": "Mã bưu điện là không hợp lệ",
  "address.invalid": "Địa chỉ không hợp lệ",
  "first_name.blank": "Họ đầu tiên bị thiếu hoặc trống",
  "last_name.blank": "Tên bị thiếu hoặc trống",
  "dob.blank": "Ngày sinh không hợp lệ",
  "address.blank": "Địa chỉ bị thiếu hoặc trống",
  "city.blank": "Thành phố bị thiếu hoặc trống",
  "country.blank": "Quốc gia bị thiếu hoặc trống",
  "postcode.blank": "Postcode thiếu hoặc trống",
  "country.must have alpha2 or alpha3 format":
    "Quốc gia phải có định dạng alpha2 hoặc alpha3",

  "totp.error": "Mã OTP không hợp lệ",

  "record.not_found": "Không tìm thấy hồ sơ",
  "jwt.decode_and_verify": "Không thể giải mã và xác minh JWT",
  "authz.invalid_session": "Không thể giải mã cookie",
  "authz.user_not_active": "Người dùng không hoạt động",
  "authz.invalid_signature": "Tiêu đề API không hợp lệ",
  "authz.apikey_not_active": "Trạng thái khóa API không hoạt động",
  "authz.disabled_2fa": "Chủ sở hữu khóa API đã vô hiệu hóa 2FA",
  "authz.invalid_api_key_headers": "Tiêu đề API trống hoặc thiếu",
  "authz.permission_denied": "Đường dẫn bị liệt vào danh sách đen",
  "authz.unexistent_apikey": "X-Auth-Apikey header không hợp lệ",

  // validation errors
  // identity module
  "identity.user.missing_email": "Bạn chưa nhập Email",
  "identity.user.empty_email": "Bạn chưa nhập Email",
  "identity.user.missing_password": "Bạn chưa nhập Mật khẩu",
  "identity.user.empty_password": "Bạn chưa nhập Mật khẩu",
  "identity.user.missing_token": "Bạn chưa nhập Token",
  "identity.user.empty_token": "Bạn chưa nhập Token",
  "identity.user.missing_reset_password_token":
    "Bạn chưa nhập token khôi phục mật khẩu",
  "identity.user.empty_reset_password_token":
    "Bạn chưa nhập token khôi phục mật khẩu",
  "identity.user.missing_confirm_password": "Bạn cần nhập lại mật khẩu",
  "identity.user.empty_confirm_password": "Bạn cần nhập lại mật khẩu",

  "identity.session.missing_emai": "Bạn chưa nhập Email",
  "identity.session.missing_password": "Bạn chưa nhập Mật khẩu",
  "identity.session.invalid_captcha_format": "Định dạng captcha sai",

  // resource module
  "resource.otp.missing_code": "Bạn chưa nhập mã OTP",
  "resource.otp.empty_code": "Bạn chưa nhập mã OTP",

  "resource.labels.missing_key": "Key is missing",
  "resource.labels.empty_key": "Key is missing or empty",
  "resource.labels.missing_value": "Value is missing",
  "resource.labels.empty_value": "Value is missing or empty",

  "resource.documents.missing_doc_expire":
    "Bạn chưa nhập ngày hết hạn của tài liệu",
  "resource.documents.empty_doc_expire":
    "Bạn chưa nhập ngày hết hạn của tài liệu",
  "resource.documents.missing_doc_type": "Bạn cần chọn loại tài liệu",
  "resource.documents.empty_doc_type": "Loại tài liệu bị thiếu hoặc trống",
  "resource.documents.missing_doc_number": "Bạn cần nhập số tài liệu",
  "resource.documents.empty_doc_number": "Bạn cần nhập số tài liệu",
  "resource.documents.missing_upload": "Tài liệu đính kèm bị thiếu",

  "resource.user.missing_topic": "Thiếu chủ đề",
  "resource.user.empty_topic": "Chủ đề bị thiếu hoặc trống",
  "resource.user.missing_old_password": "Bạn cần nhập mật khẩu cũ",
  "resource.user.empty_old_password": "Bạn cần nhập mật khẩu cũ",
  "resource.user.missing_new_password": "Bạn cần nhập mật khẩu mới",
  "resource.user.empty_new_password": "Bạn cần nhập mật khẩu mới",
  "resource.user.missing_confirm_password": "Bạn cần nhập lại mật khẩu",
  "resource.user.empty_confirm_password": "Bạn cần nhập lại mật khẩu",

  "resource.profile.missing_first_name": "Bạn cần nhập Họ",
  "resource.profile.missing_last_name": "Bạn cần nhập Tên",
  "resource.profile.missing_dob": "Bạn cần nhập ngày tháng năm sinh",
  "resource.profile.missing_address": "Bạn cần nhập địa chỉ",
  "resource.profile.missing_postcode": "Bạn cần nhập postcode",
  "resource.profile.missing_city": "Bạn cần nhập thành phố",
  "resource.profile.missing_country": "Bạn cần nhập đất nước Country",

  "resource.api_key.missing_algorithm": "Bạn cần nhập thuật toán mã hóa",
  "resource.api_key.empty_algorithm": "Bạn cần nhập thuật toán mã hóa",
  "resource.api_key.empty_kid": "KID is missing or empty",
  "resource.api_key.missing_totp": "Bạn cần nhập mã OTP",
  "resource.api_key.empty_totp": "Bạn cần nhập mã OTP",
  "resource.api_key.missing_kid": "KID is missing",
  "resource.api_key.empty_state": "State is missing or empty",

  "resource.phone.missing_phone_number": "Bạn cần nhập số điện thoại",
  "resource.phone.empty_phone_number": "Bạn cần nhập số điện thoại",
  "resource.phone.missing_verification_code": "Bạn cần nhập mã xác thực",
  "resource.phone.empty_verification_code": "Bạn cần nhập mã xác thực",

  // peatio
  "account.currency.doesnt_exist": "Tiền tệ không khả dụng",
  "account.deposit.invalid_state": "Deposit invalid state",
  "account.deposit.non_integer_limit":
    "Value you send could not be parsed into Integer type",
  "account.deposit.invalid_limit": "Invalid limit",
  "account.deposit.non_positive_page": "Page value must be positive",
  "account.deposit.empty_txid": "Bạn chưa nhập Txid",
  "account.deposit_address.invalid_address_format":
    "Invalid deposit address format",
  "account.deposit_address.doesnt_support_cash_address_format":
    "Currency doesn't support cash address format",
  "account.withdraw.non_integer_limit":
    "Limit Value you send could not be parsed into Integer type",
  "account.withdraw.invalid_limit": "Invalid limit",
  "account.withdraw.non_positive_page": "Page value must be positive",
  //
  "account.withdraw.non_integer_otp": "Mã OTP phải là số nguyên",
  "account.withdraw.empty_otp": "Bạn cần nhập mã OTP",
  "account.withdraw.empty_rid": "Bạn cần nhập Address",
  "account.withdraw.non_decimal_amount": "Số lượng gửi phải là số thập phân",
  "account.withdraw.non_positive_amount": "Số lượng gửi phải là số dương",
  "account.deposit.not_permitted":
    "Nạp tiền được phép sau khi xác minh qua điện thoại",
  "account.withdraw.not_permitted":
    "Vui lòng vượt qua các bước xác minh OTP để rút tiền",
  "account.withdraw.insufficient_balance": "Số dư tài khoản không đủ",
  "account.withdraw.invalid_amount": "Số tiền rút không hợp lệ",
  "account.withdraw.create_error": "Không thể tạo rút tiền",
  "account.withdraw.invalid_otp": "Mã OTP không hợp lệ",
  "account.withdraw.disabled_api": "API rút tiền bị vô hiệu hóa",

  "market.market.doesnt_exist": "Thị trường không khả dụng",
  "market.order.invalid_state": "Invalid deposit state",
  "market.order.invalid_limit": "Invalid limit",
  "market.order.non_integer_limit":
    "Limit value you send could not be parsed into Integer type",
  "market.trade.empty_page": "Page is missing or empty",
  "market.order.invalid_order_by": "Invalid order_by",
  "market.order.invalid_side": "Invalid order side",
  "market.order.non_decimal_volume": "Số lượng phải là số thập phân",
  "market.order.non_positive_volume": "Số lượng phải là số dương",
  "market.order.invalid_type": "Invalid order type",
  "market.order.non_decimal_price": "Giá phải là số thập phân",
  "market.order.non_positive_price": "Giá phải là số dương",
  //
  "market.order.non_integer_id":
    "Id value  you send could not be parsed into Integer type",
  "market.order.empty_id": "Id is missing or empty",
  "market.trade.non_integer_limit":
    "Limit value you send could not be parsed into Integer type",
  "market.trade.invalid_limit": "Invalid limit",
  //
  "market.trade.non_integer_timestamp": "Timestamp phải là số nguyên",
  "market.trade.empty_timestamp": "Bạn cần nhập Timestamp",
  "market.trade.invalid_order_by": "Invalid order_by",
  "market.order.insufficient_market_liquidity":
    "Thị trường không đủ để thanh toán cho lệnh của bạn",
  "market.order.invalid_volume_or_price": "Số lượng hoặc giá không hợp lệ",
  "market.order.create_error": "Không thể tạo lệnh lúc này",
  "market.order.cancel_error": "Không thể hủy lệnh lúc này",
  "market.order.market_order_price":
    "Không được nhập giá khi đang chọn lệnh thị trường",
  "market.trade.not_permitted":
    "Vui lòng xác minh tài khoản để được phép giao dịch",
  "market.account.insufficient_balance": "Số dư tài khoản không đủ",

  "public.currency.doesnt_exist": "Tiền tệ không khả dụng",
  "public.currency.invalid_type": "Loại tiền không khả dụng",
  "public.market.doesnt_exist": "Thị trường không khả dụng",
  //
  "public.order_book.non_integer_ask_limit":
    "Ask limit value you send could not be parsed into Integer type",
  "public.order_book.invalid_ask_limit": "Invlalid ask limit",
  "public.order_book.non_integer_bid_limit":
    "Bid limir value you send could not be parsed into Integer type",
  "public.order_book.invalid_bid_limit": "Invalid bid limit",
  "public.trade.non_integer_limit":
    "Limit value you send could not be parsed into Integer type",
  "public.trade.invalid_limit": "Invalid limit",
  "public.trade.non_positive_page": "Page value must be positive",
  "public.trade.non_integer_timestamp":
    "Timestamp value you send could not be parsed into Integer type",
  "public.trade.invalid_order_by": "Invalid order by",
  "public.market_depth.non_integer_limit":
    "Limit value you send could not be parsed into Integer type",
  "public.market_depth.invalid_limit": "Invalid limit",
  "public.k_line.non_integer_period":
    "Limit value you send could not be parsed into Integer type",
  "public.k_line.invalid_period": "Invalid period",
  "public.k_line.non_integer_time_from":
    "Limit value you send could not be parsed into Integer type",
  "public.k_line.empty_time_from": "Time_from param is missing or empty",
  "public.k_line.non_integer_time_to":
    "Limit value you send could not be parsed into Integer type",
  "public.k_line.empty_time_to": "Time_to param is missing or empty",
  "public.k_line.non_integer_limit":
    "Limit value you send could not be parsed into Integer type",
  "public.k_line.invalid_limit": "Invalid limit",
  //

  "server.internal_error": "Lỗi hệ thống"
};
