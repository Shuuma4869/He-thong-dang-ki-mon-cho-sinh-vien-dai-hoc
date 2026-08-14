# Kiến trúc backend

Backend dùng Spring Boot 3.3.5 và Java 21.

## Package chính

Package gốc:

```text
vn.edu.phenikaa.courseregistration
```

Các package:

- `config`
- `controller`
- `dto.request`
- `dto.response`
- `exception`
- `interfaces`
- `mapper`
- `model`
- `model.enums`
- `repository`
- `repository.file`
- `service`
- `utils`
- `validator`
- `validator.context`

## Luồng xử lý

```text
Controller
-> Service
-> Validator nếu là đăng ký
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

## Controller

Controller hiện có:

- `AuthController`
- `StudentController`
- `CourseController`
- `RegistrationController`
- `TimetableController`

Controller trả `ApiResponse<T>` khi thành công. Lỗi nghiệp vụ ném `BusinessException` hoặc subclass và được `GlobalExceptionHandler` chuyển thành `ApiErrorResponse`.

## Service

- `AuthService`: demo login bằng `studentId`.
- `StudentService`: đọc thông tin sinh viên.
- `CourseService`: đọc/search course và resolve lecturer.
- `RegistrationService`: đăng ký/hủy đăng ký, chạy validator chain, cập nhật capacity.
- `TimetableService`: tính thời khóa biểu từ registration active.

Service không tự mở file JSON.

## Repository và File IO

Repository interface:

- `StudentRepository`
- `LecturerRepository`
- `CourseRepository`
- `RegistrationRepository`

Triển khai JSON:

- `JsonStudentRepository`
- `JsonLecturerRepository`
- `JsonCourseRepository`
- `JsonRegistrationRepository`

Tất cả đọc/ghi file qua `JsonFileUtils`.

## Cấu hình

`backend/src/main/resources/application.properties`:

```properties
server.port=8080
app.data-dir=../data
app.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

`app.data-dir` có thể override theo môi trường. Không hard-code đường dẫn máy cá nhân trong source.

## Không sử dụng

- Database
- JPA/Hibernate
- JWT
- Spring Security
- Redis
- Docker runtime bắt buộc
