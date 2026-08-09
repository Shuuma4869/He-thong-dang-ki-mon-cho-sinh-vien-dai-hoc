# Thiết kế lớp và đối tượng

Tài liệu này mô tả domain, DTO và các điểm áp dụng OOP theo code hiện tại.

## Domain model

| Lớp | Vai trò | Field chính |
|---|---|---|
| `User` | Abstract class dùng chung cho người dùng | `id`, `fullName` |
| `Student` | Sinh viên kế thừa `User` | `className`, `major`, `maxCredits` |
| `Lecturer` | Giảng viên kế thừa `User` | `faculty` |
| `Course` | Học phần/lớp học phần | `courseId`, `courseName`, `credits`, `lecturerId`, `maxCapacity`, `currentCapacity`, `schedules` |
| `Schedule` | Lịch học của course | `dayOfWeek`, `startTime`, `endTime`, `room` |
| `Registration` | Phiếu đăng ký của sinh viên | `registrationId`, `studentId`, `status`, `registeredAt`, `details` |
| `RegistrationDetail` | Dòng chi tiết đăng ký | `courseId` |
| `RegistrationStatus` | Trạng thái phiếu đăng ký | `ACTIVE`, `CANCELLED` |

Composition model:

- `CourseWithLecturer`: record gồm `Course` và `Lecturer`, dùng khi trả course kèm thông tin giảng viên.
- `RegistrationSummary`: record gồm `Registration` và `List<CourseWithLecturer>`, dùng khi trả danh sách môn đã đăng ký.
- `TimetableEntry`: record gồm `Course`, `Lecturer`, `Schedule`, dùng để tạo timetable response.

DTO không được gọi là entity. DTO chỉ là dữ liệu đi qua REST API.

## Response DTO

`StudentResponse`:

- `studentId`
- `fullName`
- `className`
- `major`
- `maxCredits`

`CourseResponse` và `RegisteredCourseResponse`:

- `courseId`
- `courseName`
- `credits`
- `lecturerId`
- `lecturer`
- `maxCapacity`
- `currentCapacity`
- `schedules`

`RegistrationResponse`:

- `registrationId`
- `studentId`
- `status`
- `registeredAt`
- `details`
- `courses`
- `totalCredits`

`TimetableSlotResponse`:

- `courseId`
- `courseName`
- `credits`
- `lecturerName`
- `dayOfWeek`
- `startTime`
- `endTime`
- `room`

## Áp dụng lập trình hướng đối tượng

| Requirement | Implementation | Class/File |
|---|---|---|
| Encapsulation | Field domain là `private`, truy cập qua getter/setter | `User`, `Student`, `Course`, `Registration` |
| Inheritance | Sinh viên và giảng viên kế thừa lớp cha người dùng | `Student extends User`, `Lecturer extends User` |
| Abstraction | Lớp cha abstract và contract repository/validator | `abstract User`, `CourseValidator`, repository interfaces |
| Polymorphism | Spring inject `List<CourseValidator>` và gọi cùng method `validate` | `RegistrationService`, 5 validator |
| Interface | Contract nghiệp vụ và persistence | `Registrable`, `CourseValidator`, `StudentRepository`, `CourseRepository`, `RegistrationRepository`, `LecturerRepository` |
| Collections | Danh sách và map lookup để resolve dữ liệu | `List`, `Map` trong `CourseService`, `RegistrationService`, `TimetableService` |
| Exception Handling | Lỗi nghiệp vụ có `errorCode` và response thống nhất | `BusinessException`, subclasses, `GlobalExceptionHandler` |
| File IO | Đọc/ghi JSON qua utility dùng chung | `JsonFileUtils`, `Json*Repository` |

## Ranh giới lớp

- Model không đọc/ghi JSON.
- Mapper không gọi repository.
- Controller không chứa rule nghiệp vụ.
- Service không tự mở file.
- Validator không ghi dữ liệu và không tạo DTO.
- Repository JSON không xử lý rule nghiệp vụ đăng ký.

## Registration design

`RegistrationService` triển khai `Registrable`.

Đăng ký course:

1. Kiểm tra student tồn tại.
2. Lấy requested course bằng `CourseRepository`.
3. Lấy active registration hiện tại nếu có.
4. Tạo `RegistrationValidationContext`.
5. Chạy `List<CourseValidator>`.
6. Nếu hợp lệ, lưu registration và tăng `Course.currentCapacity`.
7. Trả `RegistrationSummary` để mapper tạo `RegistrationResponse`.

Hủy đăng ký:

1. Kiểm tra student tồn tại.
2. Kiểm tra course tồn tại.
3. Tìm active registration có course cần hủy.
4. Xóa detail tương ứng.
5. Nếu không còn detail, đổi status thành `CANCELLED`.
6. Lưu registration và giảm capacity nhưng không để âm.

## Timetable design

Không có entity hoặc JSON persistence riêng cho thời khóa biểu.

`TimetableService` tạo `TimetableEntry` từ:

```text
ACTIVE Registration
-> RegistrationDetail.courseId
-> Course
-> Course.schedules
-> Lecturer
```

Một course nhiều lịch học tạo nhiều timetable slot.
