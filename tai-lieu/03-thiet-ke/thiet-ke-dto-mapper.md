# Thiết kế DTO và mapper

DTO response chính:

- `StudentResponse`.
- `CourseResponse`.
- `LecturerResponse`.
- `ScheduleResponse`.
- `RegistrationResponse`.
- `RegisteredCourseResponse`.
- `TimetableSlotResponse`.
- `ApiResponse`.
- `ApiErrorResponse`.

Mapper chính:

- `StudentMapper`.
- `CourseMapper`.
- `RegistrationMapper`.
- `TimetableMapper`.

Mapper giúp controller không trả trực tiếp model nội bộ nếu response cần ghép thêm dữ liệu như giảng viên hoặc lịch học.

