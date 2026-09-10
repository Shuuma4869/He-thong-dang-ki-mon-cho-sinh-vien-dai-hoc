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

```powershell
cd backend
.\mvnw.cmd spring-boot:run
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

Lần chạy đầu `backend\mvnw.cmd` sẽ tải Maven và dependency vào cache người dùng. Đây là hành vi bình thường.

## Backend lỗi khi project nằm trong đường dẫn có dấu

Ưu tiên clone repository vào đường dẫn ngắn, không dấu. Sau đó chạy:

```powershell
cd backend
.\mvnw.cmd verify
.\mvnw.cmd spring-boot:run
```

Nếu vẫn gặp `ClassNotFoundException`, chạy lại:

```powershell
.\mvnw.cmd clean verify
.\mvnw.cmd spring-boot:run
```

## `npm run build` lỗi `spawn EPERM`

Nếu môi trường chặn process con, Vite/esbuild có thể báo `spawn EPERM`. Kiểm tra quyền chạy Node.js rồi thực hiện lại lệnh build; nếu build thành công sau đó thì source code không có lỗi tương ứng.

## Không thấy thông báo lưu sau refresh

Notifications hiện chỉ là local state ở frontend, không có backend persistence.
