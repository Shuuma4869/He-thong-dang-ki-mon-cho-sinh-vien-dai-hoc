# Giới thiệu dự án

“Hệ thống đăng ký môn học” là đồ án OOP nhóm 2 tại Đại học Phenikaa.

Dự án mô phỏng luồng sinh viên đăng nhập, xem môn học, đăng ký/hủy đăng ký, xem thời khóa biểu và theo dõi trạng thái học phần. Backend Spring Boot xử lý nghiệp vụ và lưu dữ liệu vào các file JSON; frontend React hiển thị giao diện dashboard và gọi REST API qua shared API client.

## Phạm vi core

- Sinh viên: đọc thông tin sinh viên và giới hạn tín chỉ.
- Môn học: danh sách, chi tiết, tìm kiếm, lịch học, giảng viên và sĩ số.
- Đăng ký: đăng ký, hủy đăng ký, tổng tín chỉ, cập nhật sĩ số.
- Thời khóa biểu: tính từ registration `ACTIVE`, course, schedule và lecturer.

## Phạm vi hỗ trợ

- Auth demo: định danh bằng `studentId`, không xác thực mật khẩu thật.
- Dashboard: tổng hợp dữ liệu ở frontend từ các API đã có.
- Notifications: demo/local state ở frontend, không có backend persistence.

## Giới hạn

Dự án không dùng database, JPA, Hibernate, JWT hoặc Spring Security. JSON File IO được chọn để phù hợp yêu cầu đồ án OOP và dễ demo trên máy local.
