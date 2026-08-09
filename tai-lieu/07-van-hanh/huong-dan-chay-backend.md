# Hướng dẫn chạy backend

## Cập nhật F17

Backend hiện đã có REST API thật cho auth demo, student/profile, course, registration và timetable.
Dữ liệu được đọc/ghi từ `data/*.json` thông qua repository JSON File IO.
Không dùng database, JPA, Hibernate, JWT hoặc Spring Security.

Yêu cầu:

- JDK 21.
- Không bắt buộc cài Maven hệ thống vì project đã có Maven Wrapper.

Chạy backend từ root repository:

```powershell
scripts\chay-backend.bat
```

Kiểm tra backend:

```powershell
backend\mvnw.cmd clean test
backend\mvnw.cmd clean package
```

Root `/` có thể trả 404. Kiểm tra API bằng `http://localhost:8080/api/courses` hoặc đăng nhập frontend bằng `SV001`.

Nếu chạy trực tiếp `backend\mvnw.cmd spring-boot:run` trong đường dẫn Windows có dấu tiếng Việt và gặp lỗi classpath, dùng script trên để chạy qua drive-letter tạm.
