# Báo cáo kiểm thử tích hợp

## Phạm vi

Kiểm thử tích hợp trên trình duyệt thật cho “Hệ thống đăng ký môn học”, gồm frontend React, backend Spring Boot và dữ liệu JSON local.

## Môi trường

Backend:

- URL: `http://localhost:8080`
- API base: `http://localhost:8080/api`
- Data source: `data/*.json`
- Không dùng database, JPA, Hibernate, JWT hoặc Spring Security.

Frontend:

- URL: `http://localhost:3000`
- React + TypeScript + Vite
- API runtime mặc định: `http://localhost:8080/api`

## Bảo vệ dữ liệu

Trước thao tác ghi, backup:

- `data/students.json`
- `data/lecturers.json`
- `data/courses.json`
- `data/registrations.json`

Sau kiểm thử, restore baseline:

- SV001: OOP101 + WEB201, tổng 6 tín chỉ.
- SV002: không có registration active.
- SV003: MATH110.
- DBS202: `currentCapacity = 28`.

## Luồng trình duyệt

| Nhóm | Scenario | Kết quả |
|---|---|---|
| Auth | Login demo SV001 với mật khẩu bất kỳ | PASS |
| Auth | Login SV999 | PASS, backend trả `STUDENT_NOT_FOUND` |
| Auth | Logout | PASS |
| Dashboard | SV001 hiển thị baseline 2 môn, 6/10 tín chỉ | PASS |
| Course | Danh sách hiển thị 10 môn | PASS |
| Course | Search `DBS202` | PASS |
| Course | Search keyword không tồn tại | PASS, empty state |
| Course | Course detail | PASS |
| Registration | Đăng ký DBS202 cho SV001 | PASS, tổng tín chỉ 6 -> 9 |
| Registration | Duplicate course | PASS, `DUPLICATE_REGISTRATION` |
| Registration | Course full AI301 | PASS, `COURSE_FULL` |
| Registration | Schedule conflict NET203 trên baseline SV001 | PASS, `SCHEDULE_CONFLICT` |
| Registration | Credit exceeded CLOUD301 | PASS, `CREDIT_LIMIT_EXCEEDED` |
| Registration | Hủy DBS202 | PASS, tổng tín chỉ 9 -> 6 |
| Persistence | Restart backend sau mutation | PASS, JSON persistence hoạt động |
| Timetable | Timetable cập nhật khi đăng ký/hủy | PASS |
| Profile | Hồ sơ SV001 hiển thị đúng dữ liệu API | PASS |
| Notifications | Demo/local render, mark read/all read | PASS |
| Multi-user | SV002 empty state, không lẫn dữ liệu SV001 | PASS |
| Responsive | Desktop/mobile smoke | PASS |

## Negative APIs

| API | Kết quả |
|---|---|
| `POST /api/students/SV001/registrations` với course đã đăng ký | `400 DUPLICATE_REGISTRATION` |
| `POST /api/students/SV001/registrations` với `AI301` | `400 COURSE_FULL` |
| `POST /api/students/SV001/registrations` với `CLOUD301` | `400 CREDIT_LIMIT_EXCEEDED` |
| `GET /api/students/SV999/registrations` | `400 STUDENT_NOT_FOUND` |

Các negative case không mutate `courses.json` hoặc `registrations.json`.

## Ảnh minh chứng

Ảnh minh chứng cho luồng đăng nhập, danh sách học phần và trạng thái đăng ký được lưu trong `ho-so-nop-bai/anh-demo/` khi nhóm cần chuẩn bị hồ sơ nộp bài. Các ảnh phát sinh khi kiểm thử giao diện được quản lý riêng, không tự đưa vào commit nếu chưa có quyết định của nhóm.

## Ghi chú kỹ thuật

- Browser automation không cần truy cập trực tiếp `localStorage`; remember/session flow được xác nhận qua hành vi và source.
- `frontend/src/shared/api/httpClient.ts` không gắn `Authorization`, `Bearer`, token hoặc password vào header.
- Frontend không đọc trực tiếp `data/*.json`.
- Sandbox có thể chặn Vite/esbuild bằng `spawn EPERM`; build ngoài sandbox pass.

## Kết luận

Kiểm thử tích hợp PASS. Hệ thống chạy được frontend-backend thật với JSON File IO, registration mutation/persistence và các validator chính.
