# Kịch bản dữ liệu demo

Tài liệu này mô tả baseline trong `data/*.json` sau khi mở rộng dữ liệu lên 40 học phần.

## Students

| Student | Mục đích demo | Max credits | Baseline |
|---|---|---:|---|
| 23010690 - Nguyễn Trọng Tuấn | Sinh viên chính để demo validator | 18 | OOP101 + WEB201 + DSA102 + DBS202 + SE204 |
| SV002 - Trần Hoàng Nam | Empty registration/timetable/dashboard | 18 | Chưa có registration |
| SV003 - Lê Thu Hà | Sinh viên phụ có registration độc lập | 9 | MATH110 |

## Lecturers

Dataset hiện có 10 giảng viên `GV001` đến `GV010`. Mỗi `course.lecturerId` phải tham chiếu đúng một giảng viên trong `data/lecturers.json`.

## Courses

Dataset hiện có đúng 40 học phần. Danh sách học phần trên frontend hiển thị 10 môn/trang, có 4 trang, và search chạy trên toàn bộ 40 môn trước khi phân trang kết quả.

Các học phần khóa case demo:

| Course | Credits | Capacity | Schedule | Purpose |
|---|---:|---:|---|---|
| OOP101 | 3 | 42/60 | MONDAY 07:30-09:30 | 23010690 đã đăng ký, duplicate case |
| WEB201 | 3 | 37/55 | TUESDAY 07:30-09:30 | 23010690 đã đăng ký, search by name |
| DSA102 | 3 | 52/70 | SATURDAY 07:30-10:30 | Baseline, không trùng lịch |
| DBS202 | 3 | 28/50 | WEDNESDAY 09:45-11:45 | Baseline, kiểm tra timetable/dashboard |
| SE204 | 3 | 33/50 | THURSDAY 07:30-09:30; FRIDAY 09:45-11:45 | Baseline nhiều lịch |
| NET203 | 2 | 31/45 | MONDAY 08:30-10:30 | Schedule conflict với OOP101 |
| AI301 | 2 | 40/40 | THURSDAY 13:00-15:00 | COURSE_FULL |
| CLOUD301 | 5 | 20/45 | FRIDAY 13:00-16:00 | CREDIT_LIMIT_EXCEEDED với 23010690 |
| UX205 | 2 | 18/35 | SUNDAY 08:00-10:00 | Register success, không trùng lịch |

## Registration baseline

| Student | Registration | Status | Courses | Total credits |
|---|---|---|---|---:|
| 23010690 | REG-23010690-DEMO | ACTIVE | OOP101, WEB201, DSA102, DBS202, SE204 | 15 |
| SV002 | none | none | none | 0 |
| SV003 | REG-SV003-DEMO | ACTIVE | MATH110 | 2 |

## Credit math

23010690 baseline:

```text
OOP101 3 + WEB201 3 + DSA102 3 + DBS202 3 + SE204 3 = 15 credits
23010690 maxCredits = 18
```

Register success:

```text
15 + UX205 2 = 17 <= 18
Expected: success
```

Credit limit:

```text
15 + CLOUD301 5 = 20 > 18
Expected: CREDIT_LIMIT_EXCEEDED
```

## Schedule conflict formula

23010690 baseline có OOP101:

```text
OOP101: MONDAY 07:30-09:30
NET203: MONDAY 08:30-10:30
```

Rule:

```text
same day
AND newStart < existingEnd
AND newEnd > existingStart
```

Kết quả:

```text
MONDAY == MONDAY
08:30 < 09:30
10:30 > 07:30
Expected: SCHEDULE_CONFLICT
```

Boundary không conflict:

```text
existingEnd == newStart
newEnd == existingStart
```

## Scenario matrix

| Scenario | Student | Course/Keyword | Expected result |
|---|---|---|---|
| LOGIN_SUCCESS | 23010690 | password bất kỳ | success |
| EMPTY_REGISTRATION | SV002 | none | `courses: []`, `totalCredits: 0` |
| SEARCH_BY_ID | none | OOP | OOP101 |
| SEARCH_ALL_DATA | none | UX205 hoặc CLOUD301 | tìm trên toàn bộ 40 môn |
| PAGINATION | none | page 1-4 | mỗi trang tối đa 10 môn |
| REGISTER_SUCCESS | 23010690 | UX205 | success, totalCredits 15 -> 17 |
| COURSE_FULL | 23010690 | AI301 | `COURSE_FULL` |
| DUPLICATE_REGISTRATION | 23010690 | OOP101 | `DUPLICATE_REGISTRATION` |
| CREDIT_LIMIT_EXCEEDED | 23010690 | CLOUD301 | `CREDIT_LIMIT_EXCEEDED` |
| SCHEDULE_CONFLICT | 23010690 baseline | NET203 | `SCHEDULE_CONFLICT` |
| CANCEL_SUCCESS | 23010690 | UX205 sau khi register | success, totalCredits 17 -> 15 |
| TIMETABLE_BASELINE | 23010690 | baseline | timetable có 5 môn đã đăng ký |

## Search

- `OOP` -> OOP101.
- `Web` -> WEB201.
- `UX205` -> UX205.
- `Cloud` -> CLOUD301.

Search là lowercase contains theo JVM locale root, không cam kết bỏ dấu tiếng Việt.

## Data integrity

Sau khi demo mutation, restore baseline:

- 23010690 chỉ có OOP101 + WEB201 + DSA102 + DBS202 + SE204.
- DBS202 `currentCapacity = 28`.
- UX205 `currentCapacity = 18`.
- `git diff -- data/` phải rỗng nếu demo đã restore đúng.
