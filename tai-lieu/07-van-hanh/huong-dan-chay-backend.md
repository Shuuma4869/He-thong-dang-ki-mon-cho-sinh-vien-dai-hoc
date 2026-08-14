# Hướng dẫn chạy backend

Backend là Spring Boot Java 21, chạy REST API tại port `8080` và đọc/ghi dữ liệu trong `data/*.json`.

## Yêu cầu

- JDK 21.
- Không cần cài Maven hệ thống vì project có Maven Wrapper.

Kiểm tra:

```powershell
java -version
javac -version
```

## Chạy backend

Từ root repository:

```powershell
scripts\chay-backend.bat
```

Script này chạy JAR đã package của backend. Nếu chưa có JAR trong `backend/target`, script sẽ tự chạy `mvnw.cmd -DskipTests package` trước khi mở backend. Cách chạy qua JAR giúp giảm lỗi classpath trên Windows khi project nằm trong đường dẫn có dấu tiếng Việt.

Backend chạy tại:

```text
http://localhost:8080
```

Nếu `8080` đang bị ứng dụng khác chiếm, `scripts\chay-backend.bat` sẽ tự chuyển backend sang:

```text
http://localhost:18080
```

API base:

```text
http://localhost:8080/api
```

Khi dùng port dự phòng, API base là:

```text
http://localhost:18080/api
```

Root `/` có thể trả 404. Kiểm tra API bằng:

```text
http://localhost:8080/api/courses
```

## Kiểm tra backend

```powershell
backend\mvnw.cmd clean test
backend\mvnw.cmd clean package
```

Kết quả regression gần nhất: 99 tests pass.

## Cấu hình

`backend/src/main/resources/application.properties`:

```properties
server.port=8080
app.data-dir=../data
app.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

Không cần PostgreSQL, Docker, Redis, JPA, Hibernate, JWT hoặc Spring Security.
