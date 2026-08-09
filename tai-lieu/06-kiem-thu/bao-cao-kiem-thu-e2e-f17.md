# Báo cáo kiểm thử E2E F17

## Phạm vi

Kiểm thử end-to-end trên trình duyệt thật cho Full Solution local của “Hệ thống đăng ký môn học”.

Branch kiểm thử: `reference/full-solution`.

Branch reference là local only trong phase này, không push.

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

## Browser flow PASS

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

## Screenshot inventory

Ảnh hiện có trong `ho-so-nop-bai/anh-demo/`:

- `ho-so-nop-bai/anh-demo/f17-login-page.png`
- `ho-so-nop-bai/anh-demo/f17-desktop-sv002-registered-empty.png`
- `ho-so-nop-bai/anh-demo/f17-mobile-course-list.png`
- `ho-so-nop-bai/anh-demo/login-redesign-desktop.png`
- `ho-so-nop-bai/anh-demo/login-redesign-mobile.png`

Trạng thái Git trên branch reference tại F18:

- `f17-desktop-sv002-registered-empty.png` và `f17-mobile-course-list.png` đang thuộc lịch sử branch reference.
- `f17-login-page.png`, `login-redesign-desktop.png`, `login-redesign-mobile.png` là evidence local/untracked.
- F18 không tự stage hoặc commit ảnh nếu chưa có quyết định riêng.

## Ghi chú kỹ thuật

- Browser automation không cần truy cập trực tiếp `localStorage`; remember/session flow được xác nhận qua hành vi và source.
- `frontend/src/shared/api/httpClient.ts` không gắn `Authorization`, `Bearer`, token hoặc password vào header.
- Frontend không đọc trực tiếp `data/*.json`.
- Sandbox có thể chặn Vite/esbuild bằng `spawn EPERM`; build ngoài sandbox pass.

## Kết luận

F17 E2E PASS. Full Solution local chạy được frontend-backend thật với JSON File IO, registration mutation/persistence và các validator chính.
