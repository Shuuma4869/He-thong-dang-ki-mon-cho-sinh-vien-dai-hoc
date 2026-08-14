# Schema JSON

Tài liệu này mô tả schema của 4 file dữ liệu trong `data/`.

## `data/students.json`

Root là array.

```json
[
  {
    "id": "23010690",
    "fullName": "Nguyen Trong Tuan",
    "className": "CNTT7 - K17",
    "major": "Cong nghe thong tin",
    "maxCredits": 18
  }
]
```

Field:

- `id`: mã sinh viên.
- `fullName`: họ tên sinh viên.
- `className`: lớp hành chính.
- `major`: ngành học.
- `maxCredits`: số tín chỉ tối đa được đăng ký trong kỳ.

Không lưu `totalRegisteredCredits` trong `Student`; giá trị này tính từ `Registration` và `Course`.

## `data/lecturers.json`

```json
[
  {
    "id": "GV001",
    "fullName": "TS. Pham Quoc Bao",
    "faculty": "Khoa Cong nghe thong tin"
  }
]
```

Field:

- `id`: mã giảng viên.
- `fullName`: họ tên giảng viên.
- `faculty`: khoa hoặc đơn vị chuyên môn.

## `data/courses.json`

```json
[
  {
    "courseId": "OOP101",
    "courseName": "Lap trinh huong doi tuong",
    "credits": 3,
    "lecturerId": "GV001",
    "maxCapacity": 60,
    "currentCapacity": 42,
    "schedules": [
      {
        "dayOfWeek": "MONDAY",
        "startTime": "07:30:00",
        "endTime": "09:30:00",
        "room": "A2-301"
      }
    ]
  }
]
```

Field:

- `courseId`: mã học phần/lớp học phần.
- `courseName`: tên học phần.
- `credits`: số tín chỉ.
- `lecturerId`: mã giảng viên phụ trách.
- `maxCapacity`: sức chứa tối đa.
- `currentCapacity`: sĩ số hiện tại.
- `schedules`: danh sách lịch học.

`dayOfWeek` dùng enum Java `DayOfWeek`: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`.

`startTime` và `endTime` dùng ISO time `HH:mm:ss`.

## `data/registrations.json`

```json
[
  {
    "registrationId": "REG-23010690-DEMO",
    "studentId": "23010690",
    "status": "ACTIVE",
    "registeredAt": "2026-08-05T08:15:00",
    "details": [
      {
        "courseId": "OOP101"
      }
    ]
  }
]
```

Field:

- `registrationId`: mã phiếu đăng ký.
- `studentId`: mã sinh viên.
- `status`: trạng thái đăng ký.
- `registeredAt`: thời điểm tạo phiếu.
- `details`: danh sách course đã đăng ký.

`RegistrationStatus`:

- `ACTIVE`
- `CANCELLED`

## File không tồn tại theo thiết kế

- Không có `timetable.json`: thời khóa biểu được tính từ registration active.
- Không có `notifications.json`: notifications chỉ là demo/local state ở frontend.
