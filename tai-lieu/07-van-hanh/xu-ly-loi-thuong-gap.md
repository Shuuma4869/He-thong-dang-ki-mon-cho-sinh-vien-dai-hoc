# Xử lý lỗi thường gặp

## `vite` không được nhận diện

Chưa cài dependency frontend.

```powershell
cd frontend
npm ci
```

## Frontend không kết nối được backend

Kiểm tra backend đang chạy:

```text
http://localhost:8080/api/courses
```

Nếu backend chưa chạy, mở terminal ở root:

```bash
cd backend
java -jar target/course-registration-0.0.1-SNAPSHOT.jar --server.port=8080
```

Nếu thấy `Web server failed to start. Port 8080 was already in use`, đây là lỗi trùng cổng, không phải lỗi test/source. Kiểm tra backend hiện có trước:

```bash
curl -i http://localhost:8080/api/students/23010690
```

Nếu trả `200`, dùng backend đó và không khởi động thêm. Nếu không trả `200` nhưng cổng vẫn bị chiếm, dùng cổng dự phòng:

```bash
java -jar target/course-registration-0.0.1-SNAPSHOT.jar --server.port=18080
```

Nếu chạy frontend thủ công khi backend đang ở `18080`, tạo `frontend/.env.local` từ `frontend/.env.example` và sửa:

```text
VITE_API_BASE_URL=http://localhost:18080/api
```

## Login 23010690 báo lỗi

Kiểm tra `data/students.json` có sinh viên `23010690`. Auth hiện là demo identification, backend chỉ kiểm tra `studentId` tồn tại.

## Java không phải version 21

```powershell
java -version
javac -version
```

Cài JDK 21 và mở terminal mới để cập nhật `JAVA_HOME`/`PATH`.

## Maven Wrapper tải dependency chậm

Lần chạy đầu `backend/mvnw.cmd` sẽ tải Maven và dependency vào cache người dùng. Đây là hành vi bình thường.

## Backend lỗi khi project nằm trong đường dẫn có dấu

Ưu tiên clone repository vào đường dẫn ngắn, không dấu. Sau đó chạy:

```bash
cd backend
./mvnw.cmd verify
java -jar target/course-registration-0.0.1-SNAPSHOT.jar --server.port=8080
```

Nếu vẫn gặp `ClassNotFoundException`, chạy lại:

```bash
./mvnw.cmd clean verify
java -jar target/course-registration-0.0.1-SNAPSHOT.jar --server.port=8080
```

## `npm run build` lỗi `spawn EPERM`

Nếu môi trường chặn process con, Vite/esbuild có thể báo `spawn EPERM`. Kiểm tra quyền chạy Node.js rồi thực hiện lại lệnh build; nếu build thành công sau đó thì source code không có lỗi tương ứng.

## Không thấy thông báo lưu sau refresh

Notifications hiện chỉ là local state ở frontend, không có backend persistence.
