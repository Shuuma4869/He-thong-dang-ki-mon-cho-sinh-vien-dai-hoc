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
cd backend
.\mvnw.cmd spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

API base:

```text
http://localhost:8080/api
```

Root `/` có thể trả 404. Kiểm tra API bằng:

```text
http://localhost:8080/api/courses
```

## Kiểm tra backend

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd verify
```

`test` chạy 99 unit/controller-slice/regression test bằng Surefire. `verify` chạy lại nhóm này, build JAR và chạy thêm 10 integration test bằng Failsafe.

## Cấu hình

`backend/src/main/resources/application.properties`:

```properties
server.port=8080
app.data-dir=../data
app.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

Không cần PostgreSQL, Docker, Redis, JPA, Hibernate, JWT hoặc Spring Security.
