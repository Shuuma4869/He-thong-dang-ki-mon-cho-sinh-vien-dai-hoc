# Xử lý lỗi thường gặp

## `vite` không được nhận diện

Chưa cài dependency frontend.

```powershell
cd frontend
npm install
```

## Frontend không kết nối được backend

Kiểm tra backend đang chạy:

```text
http://localhost:8080/api/courses
```

Nếu backend chưa chạy, mở terminal ở root:

```powershell
scripts\chay-backend.bat
```

Nếu chạy toàn hệ thống bằng `scripts\chay-du-an.bat`, script sẽ tự dùng port `18080` khi `8080` đang bị chiếm và tự truyền `VITE_API_BASE_URL=http://localhost:18080/api` cho frontend.

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

Ưu tiên chạy:

```powershell
scripts\chay-backend.bat
```

Script chạy backend bằng JAR đã package để giảm lỗi classpath trên Windows. Nếu vẫn gặp `ClassNotFoundException`, chạy lại:

```powershell
backend\mvnw.cmd clean package
scripts\chay-backend.bat
```

## `npm run build` lỗi `spawn EPERM`

Trong sandbox hoặc môi trường bị chặn process con, Vite/esbuild có thể báo `spawn EPERM`. Chạy lại ngoài sandbox. Nếu ngoài sandbox pass thì source code không lỗi.

## Không thấy thông báo lưu sau refresh

Notifications hiện chỉ là local state ở frontend, không có backend persistence.
