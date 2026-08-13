# Thiết kế service

| Service | Trách nhiệm |
|---|---|
| `AuthService` | Kiểm tra sinh viên tồn tại khi đăng nhập demo |
| `StudentService` | Lấy hồ sơ sinh viên |
| `CourseService` | Lấy danh sách, tìm kiếm, xem chi tiết môn học |
| `RegistrationService` | Đăng ký, hủy đăng ký, tính tổng tín chỉ |
| `TimetableService` | Tạo thời khóa biểu từ registration đang hoạt động |

Service không tự mở file JSON. Mọi truy cập dữ liệu đi qua repository interface.

