# Kiểm thử API

API được kiểm tra bằng MockMvc trong các controller test:

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

