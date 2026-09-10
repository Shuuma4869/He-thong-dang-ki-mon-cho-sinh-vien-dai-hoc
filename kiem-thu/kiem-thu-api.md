# Kiểm thử API

Controller slice được kiểm tra bằng `@WebMvcTest` và MockMvc trong các unit test:

- `AuthControllerTest`.
- `StudentControllerTest`.
- `CourseControllerTest`.
- `RegistrationControllerTest`.
- `TimetableControllerTest`.

Các điểm kiểm tra:

- HTTP `200` cho luồng thành công.
- HTTP `400` cho validation hoặc business error hiện tại.
- Envelope `ApiResponse` có `success`, `message`, `data`.
- Envelope `ApiErrorResponse` có `success`, `message`, `errorCode`, `timestamp`.

Các lớp trên mock service nên không được tính là integration test.

Integration test API nằm tại:

- `CourseApiIT`: danh sách, chi tiết, tìm kiếm và lỗi không tìm thấy học phần.
- `RegistrationApiIT`: đăng ký, persistence, cập nhật sĩ số, đăng ký trùng, đầy sĩ số, vượt tín chỉ, trùng lịch và hủy đăng ký.

Chạy bằng:

```bash
cd backend
./mvnw.cmd verify
```
