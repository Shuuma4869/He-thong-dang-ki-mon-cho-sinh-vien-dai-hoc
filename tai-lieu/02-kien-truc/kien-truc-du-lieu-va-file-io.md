# Kiến trúc dữ liệu và File IO

Dữ liệu demo được lưu bằng JSON File IO để phù hợp phạm vi đồ án OOP.

## File persistence

Hệ thống hiện có đúng 4 file persistence:

- `data/students.json`
- `data/lecturers.json`
- `data/courses.json`
- `data/registrations.json`

Không có:

- `data/timetable.json`
- `data/notifications.json`

Timetable là response được tính. Notifications là demo/local state ở frontend.

## JsonFileUtils

`backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` là cơ chế đọc/ghi JSON duy nhất cho tầng repository/file.

Contract:

- Dùng Jackson `ObjectMapper`.
- Đọc/ghi UTF-8.
- Đọc `List<T>` bằng generic `readList(String fileName, Class<T> elementType)`.
- Ghi `List<T>` bằng `writeList(String fileName, List<T> items)`.
- File chưa tồn tại khi đọc thì trả danh sách rỗng.
- Ghi file thì tạo thư mục cha nếu cần.
- Đường dẫn data lấy từ `app.data-dir`, mặc định `../data`.
- Chặn tên file rỗng và path traversal bằng `normalize()` và kiểm tra `startsWith(dataDirectory)`.
- Không chứa business logic.

## Repository JSON

- `JsonStudentRepository` dùng `students.json`.
- `JsonLecturerRepository` dùng `lecturers.json`.
- `JsonCourseRepository` dùng `courses.json`.
- `JsonRegistrationRepository` dùng `registrations.json`.

Controller, service, model và frontend không đọc file trực tiếp.

## Integrity baseline

Quy tắc dữ liệu:

- `data/courses.json` baseline co dung 40 hoc phan.
- `data/lecturers.json` baseline co 10 giang vien.
- Sinh vien demo chinh la `23010690`, co 5 mon baseline tong 15/18 tin chi.
- Mỗi `Course.lecturerId` phải resolve được sang `Lecturer.id`.
- Mỗi `Registration.studentId` phải resolve được sang `Student.id`.
- Mỗi `RegistrationDetail.courseId` phải resolve được sang `Course.courseId`.
- `Course.currentCapacity <= Course.maxCapacity`.
- `Registration.status` chỉ dùng `ACTIVE` hoặc `CANCELLED`.

`Course.currentCapacity` là sĩ số aggregate persisted của lớp học phần trong demo. Khi đăng ký/hủy, backend tăng/giảm giá trị này trong `courses.json`.

## Timetable computed

`TimetableService` tính timetable theo luồng:

```text
StudentRepository
-> RegistrationRepository ACTIVE
-> CourseRepository
-> LecturerRepository
-> TimetableEntry
-> TimetableSlotResponse
```

Mỗi `Course.Schedule` tạo một entry. Response sort theo `DayOfWeek`, `startTime`, `courseId`.

## Registration mutation

Register flow:

```text
RegistrationService
-> CourseValidator chain
-> RegistrationRepository.save
-> CourseRepository.save
```

Nếu validator ném lỗi, không ghi `registrations.json` và không cập nhật `courses.json`.
