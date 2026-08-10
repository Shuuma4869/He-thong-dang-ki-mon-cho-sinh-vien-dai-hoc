# Kiến trúc tổng thể

Dự án là monorepo gồm frontend React, backend Spring Boot, data JSON và tài liệu.

## Trạng thái hiện tại

- Frontend đã kết nối REST API thật cho auth demo, profile, courses, registration, timetable và dashboard composition.
- Backend đã có controller, service, validator, repository JSON File IO, DTO, mapper và exception handler cho các flow core.
- Data baseline nằm trong `data/students.json`, `data/lecturers.json`, `data/courses.json`, `data/registrations.json`.
- Notifications chỉ là demo/local state ở frontend.
- Không dùng database, JPA, Hibernate, JWT hoặc Spring Security.

## Luồng tổng thể

```text
Browser React
-> Feature API
-> Shared requestApi/httpClient
-> REST Controller
-> Service
-> Validator nếu là đăng ký
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

## Ranh giới trách nhiệm

- Page/component frontend không gọi `fetch` trực tiếp cho flow đã có feature API.
- Frontend không đọc `data/*.json`.
- Controller chỉ nhận request, gọi service, trả `ApiResponse` hoặc để exception handler xử lý lỗi.
- Service điều phối nghiệp vụ, không tự mở file.
- Validator kiểm tra rule đăng ký, không đọc file và không tạo DTO.
- Repository interface định nghĩa thao tác dữ liệu.
- Json repository gọi `JsonFileUtils` để đọc/ghi JSON.
- `JsonFileUtils` là điểm đọc/ghi file JSON duy nhất.
- Model chỉ biểu diễn dữ liệu domain.

## Core

Student:

- `User` là abstract class dùng chung.
- `Student extends User`, có `className`, `major`, `maxCredits`.
- `StudentService` đọc sinh viên qua `StudentRepository`.

Course:

- `Course` có `courseId`, `courseName`, `credits`, `lecturerId`, `maxCapacity`, `currentCapacity`, `schedules`.
- `CourseService` resolve `Lecturer` qua `LecturerRepository`.
- Course API trả `CourseResponse` có nested `LecturerResponse`.

Registration:

- `RegistrationService` triển khai `Registrable`.
- Đăng ký chạy `List<CourseValidator>` theo thứ tự `@Order`.
- Nếu hợp lệ mới ghi `registrations.json` và cập nhật `courses.json`.
- Nếu validation fail, không mutation persistence.

Timetable:

- Không có `data/timetable.json`.
- `TimetableService` tính từ registration `ACTIVE`, course, schedule và lecturer.
- Một course có nhiều schedule tạo nhiều entry.

## Support

Auth demo:

- `POST /api/auth/login` chỉ kiểm tra `studentId` tồn tại.
- `password` không được lưu và không được xác thực như mật khẩu thật.
- Remember me ở frontend chỉ lưu `studentId`.

Dashboard:

- Không có backend dashboard API.
- Frontend tổng hợp từ `currentStudent`, Registration API, Course API và Timetable API.

Notifications:

- Chỉ là demo/local state ở frontend.
- Không có Notification model, repository, service, controller hoặc `data/notifications.json`.
