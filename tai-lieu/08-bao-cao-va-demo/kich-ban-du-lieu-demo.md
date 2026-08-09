# Kich ban du lieu demo F15

Tai lieu nay mo ta demo data baseline trong `data/*.json` sau F15.

## Students

| Student | Muc dich demo | Max credits | Baseline |
|---|---|---:|---|
| SV001 - Nguyễn Minh An | Sinh vien chinh de demo validator | 10 | Dang ky OOP101 + WEB201 |
| SV002 - Trần Hoàng Nam | Demo empty registration/timetable/dashboard | 18 | Chua co registration |
| SV003 - Lê Thu Hà | Demo sinh vien phu co registration doc lap | 9 | Dang ky MATH110 |

## Lecturers

| Lecturer | Faculty | Ghi chu |
|---|---|---|
| GV001 - TS. Phạm Quốc Bảo | Khoa Công nghệ thông tin | OOP101, CLOUD301, SE204 |
| GV002 - ThS. Nguyễn Thùy Linh | Khoa Công nghệ thông tin | WEB201, DBS202, UX205 |
| GV003 - TS. Đặng Minh Khoa | Khoa Khoa học cơ bản | DSA102, MATH110 |
| GV004 - PGS. TS. Lê Hải Yến | Khoa Công nghệ thông tin | NET203, AI301 |

## Courses

| Course | Credits | Capacity | Schedule | Purpose |
|---|---:|---:|---|---|
| OOP101 | 3 | 42/60 | MONDAY 07:30-09:30 | SV001 da dang ky, duplicate case |
| WEB201 | 3 | 37/55 | TUESDAY 07:30-09:30 | SV001 da dang ky, search by name |
| DBS202 | 3 | 28/50 | WEDNESDAY 09:45-11:45 | Register success cho SV001 |
| NET203 | 2 | 31/45 | MONDAY 08:30-10:30 | Conflict voi OOP101 |
| AI301 | 2 | 40/40 | THURSDAY 13:00-15:00 | COURSE_FULL |
| CLOUD301 | 5 | 20/45 | FRIDAY 13:00-16:00 | CREDIT_LIMIT_EXCEEDED |
| DSA102 | 4 | 52/70 | SATURDAY 07:30-10:30 | Search/extra course |
| SE204 | 3 | 33/50 | THURSDAY 07:30-09:30; FRIDAY 09:45-11:45 | Multi-schedule course |
| MATH110 | 2 | 45/80 | WEDNESDAY 13:00-15:00 | SV003 da dang ky |
| UX205 | 2 | 18/35 | SUNDAY 08:00-10:00 | Extra course, no conflict |

## Registrations baseline

| Student | Registration | Status | Courses | Total credits |
|---|---|---|---|---:|
| SV001 | REG-SV001-DEMO | ACTIVE | OOP101, WEB201 | 6 |
| SV002 | none | none | none | 0 |
| SV003 | REG-SV003-DEMO | ACTIVE | MATH110 | 2 |

## Credit math

SV001 baseline:

```text
OOP101 3 credits + WEB201 3 credits = 6 credits
SV001 maxCredits = 10
```

REGISTER_SUCCESS:

```text
6 + DBS202 3 = 9 <= 10
Expected: success
```

CREDIT_LIMIT_EXCEEDED:

```text
6 + CLOUD301 5 = 11 > 10
Expected: CREDIT_LIMIT_EXCEEDED
```

## Schedule conflict math

SV001 da co OOP101:

```text
OOP101: MONDAY 07:30-09:30
NET203: MONDAY 08:30-10:30
```

Rule backend:

```text
same DayOfWeek
AND newStart < existingEnd
AND newEnd > existingStart
```

Kiem chung:

```text
MONDAY == MONDAY
08:30 < 09:30
10:30 > 07:30
Expected: SCHEDULE_CONFLICT
```

## Scenario matrix

| Scenario | Student | Course/Keyword | Expected result | Reason | Verification |
|---|---|---|---|---|---|
| LOGIN_SUCCESS | SV001 | password bat ky | success | Auth demo chi kiem tra student ton tai | API PASS |
| EMPTY_REGISTRATION | SV002 | none | courses [], totalCredits 0 | SV002 khong co active registration | API PASS |
| SEARCH_BY_ID | none | OOP | OOP101 | CourseRepository search theo courseId lowercase contains | API PASS |
| SEARCH_BY_NAME | none | Web | WEB201 | CourseRepository search theo courseName lowercase contains | API PASS |
| REGISTER_SUCCESS | SV001 | DBS202 | success | 6 + 3 = 9 <= 10, khong full, khong conflict | API PASS |
| COURSE_FULL | SV001 | AI301 | COURSE_FULL | currentCapacity == maxCapacity | API PASS |
| DUPLICATE_REGISTRATION | SV001 | OOP101 | DUPLICATE_REGISTRATION | OOP101 da nam trong active registration | API PASS |
| CREDIT_LIMIT_EXCEEDED | SV001 | CLOUD301 | CREDIT_LIMIT_EXCEEDED | 6 + 5 = 11 > 10 | API PASS |
| SCHEDULE_CONFLICT | SV001 | NET203 | SCHEDULE_CONFLICT | Overlap voi OOP101 tren MONDAY | API PASS |
| CANCEL_SUCCESS | SV001 | DBS202 sau khi register | success | Huy course vua dang ky | API PASS |
| TIMETABLE_UPDATE | SV001 | DBS202 | timetable them/xoa DBS202 | Timetable computed tu registration ACTIVE | API PASS |

## Search scenarios

- `OOP` -> OOP101.
- `Web` -> WEB201.
- `dữ liệu` -> DBS202 neu runtime lowercase Unicode match theo JVM locale root.
- `AI` -> AI301.

Search hien tai la lowercase contains, khong co accent folding. Tu khoa khong dau nhu `du lieu` khong duoc cam ket match `dữ liệu`.

## Capacity semantics

`currentCapacity` la si so aggregate persisted cua lop hoc phan, khong bat buoc bang so registration objects trong demo subset.

API register/cancel phai tang/giam `Course.currentCapacity` dung 1 don vi.

## UTF-8

Demo data co chu tieng Viet co dau trong `fullName`, `courseName`, `faculty` de kiem tra JSON UTF-8 va Jackson.

## Ket qua verification F15B

Da chay API-level verification tren backend port `18080` bang file jar packaged.
Chua chay browser E2E trong F15.

Ket qua PASS:

- `POST /api/auth/login`: SV001, SV002 dang nhap demo thanh cong.
- `GET /api/students/SV001`: profile tra ve dung studentId.
- `GET /api/courses`: tra ve 10 course, lecturer reference resolve duoc qua `lecturer.lecturerId`.
- `GET /api/courses/search?keyword=OOP`: tra ve OOP101.
- `GET /api/courses/search?keyword=Web`: tra ve WEB201.
- `GET /api/courses/search?keyword=du lieu co dau`: tra ve DBS202.
- `GET /api/students/SV001/registrations`: baseline OOP101 + WEB201, totalCredits = 6.
- `GET /api/students/SV001/timetable`: baseline co OOP101 va WEB201.
- `GET /api/students/SV002/registrations`: courses rong, totalCredits = 0.
- `GET /api/students/SV002/timetable`: danh sach rong.
- `POST /api/students/SV001/registrations` voi OOP101: `DUPLICATE_REGISTRATION`, khong mutate `registrations.json`/`courses.json`.
- `POST /api/students/SV001/registrations` voi AI301: `COURSE_FULL`, khong mutate file JSON.
- `POST /api/students/SV001/registrations` voi NET203: `SCHEDULE_CONFLICT`, khong mutate file JSON.
- `POST /api/students/SV001/registrations` voi CLOUD301: `CREDIT_LIMIT_EXCEEDED`, khong mutate file JSON.
- `POST /api/students/SV001/registrations` voi DBS202: success, totalCredits 6 -> 9.
- Sau register DBS202: `registrations.json` them DBS202 cho SV001.
- Sau register DBS202: `courses.json` tang DBS202 `currentCapacity` 28 -> 29.
- Sau register DBS202: GET registrations va GET timetable deu co DBS202.
- Restart backend sau mutation: GET registrations van co DBS202, chung minh File IO persistence qua restart.
- `DELETE /api/students/SV001/registrations/DBS202`: success, totalCredits 9 -> 6.
- Sau cancel DBS202: `courses.json` giam DBS202 `currentCapacity` 29 -> 28.
- Sau cancel DBS202: GET registrations va GET timetable khong con DBS202.

Bug runtime phat hien:

- Scenario: dang ky lai DBS202 sau khi SV001 da dang ky DBS202 thanh cong.
- Expected: `DUPLICATE_REGISTRATION`.
- Actual: `CREDIT_LIMIT_EXCEEDED` voi message tong tin chi 12 vuot gioi han 10.
- Anh huong: error code uu tien chua dung khi duplicate course cung luc lam vuot gioi han tin chi.
- Ghi chu: request nay khong mutate `registrations.json` va `courses.json`.

Sau runtime mutation verification, 4 file `data/*.json` da duoc restore ve baseline F15A.
