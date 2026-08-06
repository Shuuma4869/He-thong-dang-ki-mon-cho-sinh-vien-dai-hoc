# Hướng dẫn chạy backend

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

Backend starter hiện chưa có API thật. Root `/` có thể trả 404 nếu ứng dụng khởi động thành công.

Nếu chạy trực tiếp `backend\mvnw.cmd spring-boot:run` trong đường dẫn Windows có dấu tiếng Việt và gặp lỗi classpath, dùng script trên để chạy qua drive-letter tạm.
