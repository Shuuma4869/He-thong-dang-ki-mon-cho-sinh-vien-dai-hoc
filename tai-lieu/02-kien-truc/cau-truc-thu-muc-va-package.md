# Cấu trúc thư mục và package

## Root

```text
.
+-- frontend/
+-- backend/
+-- data/
+-- tai-lieu/
+-- thiet-ke/
+-- ho-so-nop-bai/
+-- scripts/
+-- .github/
```

## Frontend

Frontend chia theo hướng feature-first:

- `src/app`
- `src/features`
- `src/shared`
- `src/mocks`
- `src/dev`
- `src/styles`

Feature runtime API thật:

- `auth`
- `profile`
- `courses`
- `registration`
- `timetable`
- `dashboard` dưới dạng composition frontend

Feature demo/local:

- `notifications`

## Backend

Package gốc:

```text
vn.edu.phenikaa.courseregistration
```

Các package:

- `config`: CORS, Jackson.
- `controller`: REST controllers.
- `dto.request`: request DTO.
- `dto.response`: response DTO và envelope.
- `exception`: business exception và global handler.
- `interfaces`: contract OOP như `Registrable`, `CourseValidator`.
- `mapper`: map domain/composition sang DTO.
- `model`: domain model và composition record.
- `model.enums`: enum domain.
- `repository`: repository interfaces.
- `repository.file`: JSON repository implementations.
- `service`: nghiệp vụ.
- `utils`: `JsonFileUtils`.
- `validator`: validator đăng ký.
- `validator.context`: context truyền vào validator chain.

## Data

- `students.json`
- `lecturers.json`
- `courses.json`
- `registrations.json`

Không có JSON riêng cho timetable hoặc notifications.
