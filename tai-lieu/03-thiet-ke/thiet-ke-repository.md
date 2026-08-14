# Thiết kế repository

Repository interface:

- `StudentRepository`.
- `LecturerRepository`.
- `CourseRepository`.
- `RegistrationRepository`.

Repository file:

- `JsonStudentRepository`.
- `JsonLecturerRepository`.
- `JsonCourseRepository`.
- `JsonRegistrationRepository`.

Repository file dùng `JsonFileUtils` để đọc/ghi dữ liệu. Service chỉ phụ thuộc interface, vì vậy nghiệp vụ không bị gắn trực tiếp với cơ chế lưu JSON.

