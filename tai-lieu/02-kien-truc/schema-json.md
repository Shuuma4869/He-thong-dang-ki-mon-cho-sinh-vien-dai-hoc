# Schema JSON

Tài liệu này khóa schema dữ liệu cho Full Solution local. Các file dữ liệu có thể tiếp tục là mảng rỗng `[]` cho tới phase demo data.

## `data/students.json`

Root là array.

```json
[
  {
    "id": "SV001",
    "fullName": "Nguyen Van A",
    "className": "CNTT1",
    "major": "Cong nghe thong tin",
    "maxCredits": 18
  }
]
```

Field bắt buộc:

- `id`: mã sinh viên.
- `fullName`: họ tên sinh viên.
- `className`: lớp hành chính.
- `major`: ngành học.
- `maxCredits`: số tín chỉ tối đa được đăng ký trong kỳ.

Không lưu `totalRegisteredCredits` trong `Student`; giá trị này phải tính từ `Registration` và `Course`.

## `data/lecturers.json`

Root là array.

```json
[
  {
    "id": "GV001",
    "fullName": "Tran Thi B",
    "faculty": "Khoa Cong nghe thong tin"
  }
]
```

Field bắt buộc:

- `id`: mã giảng viên.
- `fullName`: họ tên giảng viên.
- `faculty`: khoa hoặc đơn vị chuyên môn.

## `data/courses.json`

Root là array.

```json
[
  {
    "courseId": "OOP101",
    "courseName": "Lap trinh huong doi tuong",
    "credits": 3,
    "lecturerId": "GV001",
    "maxCapacity": 60,
    "currentCapacity": 20,
    "schedules": [
      {
        "dayOfWeek": "MONDAY",
        "startTime": "07:30:00",
        "endTime": "09:30:00",
        "room": "A101"
      }
    ]
  }
]
```

Field bắt buộc:

- `courseId`: mã học phần/lớp học phần.
- `courseName`: tên học phần.
- `credits`: số tín chỉ.
- `lecturerId`: mã giảng viên phụ trách.
- `maxCapacity`: sức chứa tối đa.
- `currentCapacity`: số lượng đã đăng ký hiện tại.
- `schedules`: danh sách lịch học.

`dayOfWeek` dùng enum Java `DayOfWeek`: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`.

`startTime` và `endTime` dùng định dạng ISO time: `HH:mm:ss`.

## `data/registrations.json`

Root là array.

```json
[
  {
    "registrationId": "REG001",
    "studentId": "SV001",
    "status": "ACTIVE",
    "registeredAt": "2026-08-08T19:30:00",
    "details": [
      {
        "courseId": "OOP101"
      }
    ]
  }
]
```

Field bắt buộc:

- `registrationId`: mã phiếu đăng ký.
- `studentId`: mã sinh viên.
- `status`: trạng thái đăng ký.
- `registeredAt`: thời điểm tạo/cập nhật phiếu.
- `details`: danh sách học phần đã đăng ký.

`RegistrationStatus` chỉ gồm:

- `ACTIVE`
- `CANCELLED`

