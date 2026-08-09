# Kiến trúc dữ liệu và File IO

Dự án định hướng lưu dữ liệu bằng JSON File IO trong giai đoạn OOP.

Các file dữ liệu hiện có:

- `data/students.json`
- `data/lecturers.json`
- `data/courses.json`
- `data/registrations.json`

Hiện tại các file này là mảng rỗng `[]`. Chưa có dữ liệu nghiệp vụ thật.

## Contract đọc/ghi JSON

`backend/src/main/java/vn/edu/phenikaa/courseregistration/utils/JsonFileUtils.java` là cơ chế đọc/ghi JSON duy nhất cho tầng repository/file.

Utility này phải đảm bảo:

- Dùng Jackson.
- Đọc/ghi UTF-8.
- Đọc được `List<T>` theo kiểu generic.
- Ghi được `List<T>` theo kiểu generic.
- File chưa tồn tại khi đọc thì trả về danh sách rỗng.
- Tạo thư mục cha khi ghi nếu cần.
- Không hard-code đường dẫn máy cá nhân.
- Không chứa business logic.

## Cấu hình đường dẫn data

Đường dẫn data được cấu hình bằng property:

```properties
app.data-dir=../data
```

Thành viên có thể override property này theo môi trường chạy, nhưng không được hard-code đường dẫn như `D:\...` trong source.

## Repository JSON phase sau

Các repository JSON triển khai sau này như `JsonStudentRepository`, `JsonCourseRepository`, `JsonRegistrationRepository` đều phải gọi `JsonFileUtils`.

Không được:

- Controller đọc file.
- Service đọc file.
- Model đọc file.
- Frontend đọc file `data/*.json`.

## Schema dữ liệu

Schema JSON chi tiết được khóa trong `tai-lieu/02-kien-truc/schema-json.md`.

Trong phase khóa domain, các file `data/*.json` có thể giữ `[]` để tránh thêm dữ liệu demo trước khi repository/service/test hoàn chỉnh.

## Ranh giới frontend sau F10

Frontend không đọc trực tiếp thư mục `data/`.

Auth/Profile lấy dữ liệu qua REST API:

- `POST /api/auth/login`
- `GET /api/students/{studentId}`

Sau F12, Course và Registration đã chuyển sang backend. Timetable, Dashboard và Notifications chưa được migrate thành API runtime riêng,
vì vậy các phần đó vẫn có thể dùng mock hoặc state frontend hiện có cho mục đích demo giao diện.
## Trang thai File IO sau F12

Registration API van tuan thu luong:

```text
Controller
-> RegistrationService
-> CourseValidator neu dang ky
-> Repository Interface
-> Json Repository
-> JsonFileUtils
-> data/*.json
```

`RegistrationService` khong doc file truc tiep. Khi can tra response cho frontend, service resolve du lieu dang ky bang repository:

- `RegistrationRepository` lay phieu dang ky.
- `CourseRepository.findAll()` tao map hoc phan de resolve cac `courseId` trong registration.
- `LecturerRepository.findAll()` tao map giang vien de gan thong tin lecturer cho tung hoc phan.

`RegistrationMapper` chi map composition da co san sang DTO, khong goi repository va khong doc JSON.

Frontend Registration sau F12 khong doc `data/*.json` va khong dung mock ids cho runtime. Moi thao tac dang ky, huy hoac lay danh sach da dang ky
di qua REST API backend. `data/*.json` van co the rong cho den phase tao demo data F15.

## Trang thai Timetable sau F13A

Timetable la computed response, khong tao `data/timetable.json` va khong tao repository persistence rieng.

`TimetableService` lay du lieu qua repository interface:

- `StudentRepository` kiem tra sinh vien ton tai.
- `RegistrationRepository` lay cac registration cua sinh vien va chi dung registration `ACTIVE`.
- `CourseRepository.findAll()` tao map hoc phan de resolve `courseId`.
- `LecturerRepository.findAll()` tao map giang vien de tra `lecturerName`.

Moi `Course.Schedule` tao mot timetable entry. Response duoc sort theo `DayOfWeek`, `startTime`, `courseId`.

Frontend sau F13 chi lay timetable qua REST API:

```text
GET /api/students/{studentId}/timetable
```

Khong tao `data/timetable.json`, khong cho frontend doc truc tiep `data/*.json` va khong hard-code du lieu lich hoc trong page.
