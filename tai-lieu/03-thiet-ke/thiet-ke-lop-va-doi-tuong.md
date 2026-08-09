# Thiết kế lớp và đối tượng

Tài liệu này khóa phần shared domain và contract lớp nền. Các feature Student, Course và Registration chưa được triển khai hoàn chỉnh trong bước này.

## Shared domain

`User` là lớp cha dùng chung cho các loại người dùng.

Contract bắt buộc:

- `User` là `abstract`.
- Field là `private`.
- Có `id`.
- Có `fullName`.
- Có constructor.
- Có getter/setter.
- Không chứa logic riêng của Student hoặc Lecturer.

`Student` và `Lecturer` sẽ kế thừa `User` ở các phase nghiệp vụ sau. Logic riêng của từng vai trò không được đặt trong `User`.

## Nhóm lớp backend

- Model: biểu diễn dữ liệu, không đọc/ghi JSON.
- DTO request/response: chuẩn hóa dữ liệu đi qua REST API.
- Service: điều phối nghiệp vụ, không tự mở file.
- Validator: kiểm tra rule, chỉ tạo cụ thể khi triển khai nghiệp vụ.
- Repository interface: định nghĩa thao tác dữ liệu.
- Json repository: triển khai thao tác dữ liệu qua `JsonFileUtils`.

## Shared response DTO

Response thành công dùng `ApiResponse<T>` với các field:

- `success`
- `message`
- `data`

Response lỗi dùng `ApiErrorResponse` với các field:

- `success`
- `message`
- `errorCode`
- `timestamp`

## Frontend student view model sau F10

Backend trả `StudentResponse` với dữ liệu tối thiểu:

- `studentId`
- `fullName`
- `className`
- `major`
- `maxCredits`

Frontend map dữ liệu này sang `Student` view model:

- `studentId` -> `id`
- `fullName` -> `name`
- `className` -> `className`
- `major` -> `major`
- `maxCredits` -> `maxCredits`

Những field hồ sơ chưa có trong backend như email, số điện thoại, ngày sinh, CPA, GPA và tổng tín chỉ tích lũy phải là optional ở frontend. UI chỉ hiển thị placeholder, không hard-code dữ liệu giả cho hồ sơ thật.
## Registration composition sau F12A

Backend them composition `RegistrationSummary` de tra du lieu dang ky active kem danh sach hoc phan da resolve.

Thanh phan lien quan:

- `Registration`: model phieu dang ky, giu `registrationId`, `studentId`, `status`, `registeredAt`, `details`.
- `RegistrationDetail`: model dong chi tiet, hien chi giu `courseId`.
- `RegistrationSummary`: composition gom `Registration` va `List<CourseWithLecturer>`.
- `CourseWithLecturer`: composition gom `Course` va `Lecturer`.
- `RegisteredCourseResponse`: DTO hoc phan trong danh sach da dang ky, gom `courseId`, `courseName`, `credits`, `lecturerId`, `lecturer`, `maxCapacity`, `currentCapacity`, `schedules`.
- `RegistrationResponse`: DTO tong hop gom `registrationId`, `studentId`, `status`, `registeredAt`, `details`, `courses`, `totalCredits`.

Ranh gioi bat buoc:

- Mapper khong goi repository.
- Controller khong doc JSON va khong tinh business rule.
- Service resolve composition thong qua repository interface.
- Validator chi xu ly rule dang ky, khong tao response DTO.
