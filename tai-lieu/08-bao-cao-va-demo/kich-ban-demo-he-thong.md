# Kịch bản demo hệ thống

Thời lượng đề xuất: 7-12 phút.

## Chuẩn bị

1. Restore baseline `data/*.json`.
2. Chạy backend:

```powershell
scripts\chay-backend.bat
```

3. Chạy frontend:

```powershell
cd frontend
npm run dev
```

4. Mở:

```text
http://localhost:3000
```

## Tài khoản demo

- Mã sinh viên: `23010690`
- Mật khẩu: nhập bất kỳ chuỗi không rỗng

Giải thích ngắn: auth hiện là demo identification, backend kiểm tra `studentId` tồn tại, không dùng JWT hoặc Spring Security.

## Flow chính

1. Login bằng `23010690`.
2. Mở Dashboard: giới thiệu thông tin sinh viên, tổng tín chỉ 15/18, số môn đã đăng ký.
3. Mở Danh sách môn học: hiển thị 40 môn từ Course API, tối đa 10 môn/trang.
4. Search `UX205`: chứng minh frontend gọi Course search API trên toàn bộ 40 môn.
5. Xem chi tiết UX205: giảng viên, lịch học, sĩ số.
6. Mở Môn đã đăng ký: baseline 23010690 có OOP101 + WEB201 + DSA102 + DBS202 + SE204.
7. Đăng ký UX205.
8. Chỉ ra tổng tín chỉ đổi 15 -> 17 và UX205 xuất hiện trong danh sách.
9. Mở Thời khóa biểu: UX205 xuất hiện ở SUNDAY 08:00-10:00.
10. Nếu còn thời gian, demo validation:
    - OOP101: duplicate, `DUPLICATE_REGISTRATION`.
    - AI301: full, `COURSE_FULL`.
    - CLOUD301: vượt tín chỉ, `CREDIT_LIMIT_EXCEEDED`.
    - NET203 trên baseline hoặc sau khi restore: trùng lịch với OOP101, `SCHEDULE_CONFLICT`.
11. Hủy UX205.
12. Chỉ ra tổng tín chỉ đổi 17 -> 15.
13. Mở lại Thời khóa biểu: UX205 biến mất.
14. Mở Profile: dữ liệu sinh viên lấy từ Student API.
15. Mở Notifications: nói rõ đây là demo/local state, không có backend persistence.

## Điểm OOP cần nhấn mạnh

- `Student` và `Lecturer` kế thừa `User`.
- `RegistrationService` triển khai `Registrable`.
- 5 validator triển khai `CourseValidator` và được inject dưới dạng `List<CourseValidator>`.
- Repository interface tách khỏi JSON implementation.
- `BusinessException` và `GlobalExceptionHandler` chuẩn hóa lỗi.
- `JsonFileUtils` là điểm đọc/ghi JSON duy nhất.

## Kết thúc

Nhấn mạnh giới hạn trung thực:

- JSON File IO phù hợp demo/đồ án.
- Auth là demo identification.
- Notifications local.
- Chưa có admin/lecturer portal.
- Hướng phát triển: database, transaction, Spring Security, role, notification backend.
