# Kịch bản dữ liệu demo

Tài liệu này mô tả baseline trong `data/*.json`.

## Students

| Student | Mục đích demo | Max credits | Baseline |
|---|---|---:|---|
| SV001 - Nguyễn Minh An | Sinh viên chính để demo validator | 10 | OOP101 + WEB201 |
| SV002 - Trần Hoàng Nam | Empty registration/timetable/dashboard | 18 | Chưa có registration |
| SV003 - Lê Thu Hà | Sinh viên phụ có registration độc lập | 9 | MATH110 |

## Lecturers

| Lecturer | Faculty | Course |
|---|---|---|
| GV001 - TS. Phạm Quốc Bảo | Khoa Công nghệ thông tin | OOP101, CLOUD301, SE204 |
| GV002 - ThS. Nguyễn Thùy Linh | Khoa Công nghệ thông tin | WEB201, DBS202, UX205 |
| GV003 - TS. Đặng Minh Khoa | Khoa Khoa học cơ bản | DSA102, MATH110 |
| GV004 - PGS. TS. Lê Hải Yến | Khoa Công nghệ thông tin | NET203, AI301 |

## Courses

| Course | Credits | Capacity | Schedule | Purpose |
|---|---:|---:|---|---|
| OOP101 | 3 | 42/60 | MONDAY 07:30-09:30 | SV001 đã đăng ký, duplicate case |
| WEB201 | 3 | 37/55 | TUESDAY 07:30-09:30 | SV001 đã đăng ký, search by name |
| DBS202 | 3 | 28/50 | WEDNESDAY 09:45-11:45 | Register success cho SV001 |
| NET203 | 2 | 31/45 | MONDAY 08:30-10:30 | Schedule conflict với OOP101 |
| AI301 | 2 | 40/40 | THURSDAY 13:00-15:00 | COURSE_FULL |
| CLOUD301 | 5 | 20/45 | FRIDAY 13:00-16:00 | CREDIT_LIMIT_EXCEEDED với SV001 |
| DSA102 | 4 | 52/70 | SATURDAY 07:30-10:30 | Search/extra course |
| SE204 | 3 | 33/50 | THURSDAY 07:30-09:30; FRIDAY 09:45-11:45 | Multi-schedule course |
| MATH110 | 2 | 45/80 | WEDNESDAY 13:00-15:00 | SV003 đã đăng ký |
| UX205 | 2 | 18/35 | SUNDAY 08:00-10:00 | Extra course |

## Registration baseline

| Student | Registration | Status | Courses | Total credits |
|---|---|---|---|---:|
| SV001 | REG-SV001-DEMO | ACTIVE | OOP101, WEB201 | 6 |
| SV002 | none | none | none | 0 |
| SV003 | REG-SV003-DEMO | ACTIVE | MATH110 | 2 |

## Credit math

SV001 baseline:

```text
OOP101 3 + WEB201 3 = 6 credits
SV001 maxCredits = 10
```

Register success:

```text
6 + DBS202 3 = 9 <= 10
Expected: success
```

Credit limit:

```text
6 + CLOUD301 5 = 11 > 10
Expected: CREDIT_LIMIT_EXCEEDED
```

## Schedule conflict formula

SV001 baseline có OOP101:

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
| LOGIN_SUCCESS | SV001 | password bất kỳ | success |
| EMPTY_REGISTRATION | SV002 | none | `courses: []`, `totalCredits: 0` |
| SEARCH_BY_ID | none | OOP | OOP101 |
| SEARCH_BY_NAME | none | Web | WEB201 |
| REGISTER_SUCCESS | SV001 | DBS202 | success, totalCredits 6 -> 9 |
| COURSE_FULL | SV001 | AI301 | `COURSE_FULL` |
| DUPLICATE_REGISTRATION | SV001 | OOP101 | `DUPLICATE_REGISTRATION` |
| CREDIT_LIMIT_EXCEEDED | SV001 | CLOUD301 | `CREDIT_LIMIT_EXCEEDED` |
| SCHEDULE_CONFLICT | SV001 baseline | NET203 | `SCHEDULE_CONFLICT` |
| CANCEL_SUCCESS | SV001 | DBS202 sau khi register | success, totalCredits 9 -> 6 |
| TIMETABLE_UPDATE | SV001 | DBS202 | timetable thêm/xóa DBS202 |

## Search

- `OOP` -> OOP101.
- `Web` -> WEB201.
- `AI` -> AI301.

Search là lowercase contains theo JVM locale root, không cam kết bỏ dấu tiếng Việt.

## Data integrity

Sau khi demo mutation, restore baseline:

- SV001 chỉ có OOP101 + WEB201.
- DBS202 `currentCapacity = 28`.
- `git diff -- data/` phải rỗng.
