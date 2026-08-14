# Kiến trúc xác thực

Xác thực hiện tại là cơ chế demo cho đồ án:

```text
LoginPage
-> authApi.login
-> POST /api/auth/login
-> AuthController
-> AuthService
-> StudentRepository
-> students.json
```

Backend kiểm tra `studentId` tồn tại. `password` được nhận trong request để giao diện giống hệ thống thật hơn, nhưng backend không lưu password, không log password và không tạo token.

Frontend chỉ lưu `studentId` trong `localStorage` hoặc `sessionStorage` nếu người dùng chọn ghi nhớ đăng nhập. Khi mở lại trang, frontend gọi `GET /api/students/{studentId}` để khôi phục phiên demo.

Không dùng JWT hoặc Spring Security trong phạm vi đồ án.

