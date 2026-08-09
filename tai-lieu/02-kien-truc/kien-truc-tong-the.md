# Kiến trúc tổng thể

Dự án dùng cấu trúc monorepo:

- `frontend/`: giao diện React/TypeScript/Vite, hiện vẫn chạy bằng mock data.
- `backend/`: Spring Boot skeleton, đã khóa shared technical foundation.
- `data/`: JSON data starter, hiện là các mảng rỗng.
- `tai-lieu/`: tài liệu phân tích, kiến trúc, thiết kế, quy trình và vận hành.

## Trạng thái hiện tại

Starter đã có nền kỹ thuật dùng chung cho backend và frontend, nhưng chưa hoàn thành nghiệp vụ Student, Course và Registration.

Frontend đã chuyển các luồng Auth, Profile, Course và Registration sang gọi backend thật qua shared API client.
Dashboard, Timetable và Notifications chưa được tách thành API runtime riêng trong F12.

Backend chưa dùng database, JPA, Hibernate, JWT hoặc Spring Security. Dữ liệu phase sau được định hướng lưu trong JSON file.

## Luồng backend bắt buộc

Mọi nghiệp vụ backend phải đi theo thứ tự:

```text
Controller
-> Service
-> Validator nếu có
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

Không được phá vỡ luồng này.

## Ranh giới trách nhiệm

- Controller chỉ nhận request, gọi service và trả response DTO.
- Service chứa điều phối nghiệp vụ, không tự mở file.
- Validator chứa rule kiểm tra, không tự mở file.
- Repository interface định nghĩa thao tác dữ liệu.
- Json repository triển khai repository bằng JSON file.
- `JsonFileUtils` là điểm duy nhất đọc/ghi file JSON.
- Model chỉ biểu diễn dữ liệu, không đọc JSON.
- Frontend không đọc trực tiếp `data/*.json`.

## Trạng thái tích hợp frontend F10

Frontend đã chuyển riêng luồng Auth và Profile sang gọi backend thật qua shared API client.

Các điểm đã khóa:

- `POST /api/auth/login` được gọi từ `authApi.login`.
- `GET /api/students/{studentId}` được gọi từ `profileApi.getStudentById`.
- `requestApi` là lớp unwrap `ApiResponse.data` dùng chung.
- `LoginPage` không đăng nhập giả bằng timeout và không báo thành công trước khi backend trả kết quả.
- `App` quản lý `currentStudent`, trạng thái khởi tạo phiên và storage `studentId`.
- `rememberMe = true` lưu `studentId` trong `localStorage`; `rememberMe = false` lưu trong `sessionStorage`.
- Password chỉ gửi trong request đăng nhập, không lưu vào storage.

Course và Registration trên frontend đã dùng API thật. Timetable, Dashboard và Notifications chưa được migrate thành API runtime riêng trong phase F12.

## Trang thai tich hop frontend F12

Frontend da noi API that cho cac luong dang ky hoc phan chinh:

- Lay danh sach hoc phan da dang ky cua sinh vien qua `GET /api/students/{studentId}/registrations`.
- Dang ky hoc phan qua `POST /api/students/{studentId}/registrations`.
- Huy dang ky hoc phan qua `DELETE /api/students/{studentId}/registrations/{courseId}`.

`studentId` luon lay tu sinh vien dang dang nhap trong `App`, khong hard-code `SV001`.

Registration runtime khong con dung `INITIAL_REGISTERED_IDS` de tao danh sach da dang ky. Mock data van duoc giu trong `frontend/src/mocks`
cho cac man chua migrate hoac muc dich doi chieu, nhung luong Register, Cancel, Registered Courses va Total Credits lay tu backend.

Dashboard va Timetable hien nhan danh sach da dang ky tu state chung cua frontend, nhung chua duoc tach thanh API runtime rieng trong F12.
Notifications van dung mock.
