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

