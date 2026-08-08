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

