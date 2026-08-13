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

Script map project sang drive-letter tạm để giảm lỗi classpath trên Windows.

## `npm run build` lỗi `spawn EPERM`

Trong sandbox hoặc môi trường bị chặn process con, Vite/esbuild có thể báo `spawn EPERM`. Chạy lại ngoài sandbox. Nếu ngoài sandbox pass thì source code không lỗi.

## Không thấy thông báo lưu sau refresh

Notifications hiện chỉ là local state ở frontend, không có backend persistence.
