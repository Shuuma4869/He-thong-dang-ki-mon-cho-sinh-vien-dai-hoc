# Xử lý lỗi thường gặp

## `vite` không được nhận diện

Chạy:

```powershell
cd frontend
npm install
```

## Java không phải version 21

Kiểm tra:

```powershell
java -version
javac -version
```

Cài JDK 21 và mở terminal mới để nhận `JAVA_HOME`/`PATH`.

## Maven Wrapper tải dependency chậm

Lần chạy đầu tiên `backend\mvnw.cmd` sẽ tải Maven và dependency vào cache người dùng. Đây là hành vi bình thường.

## Không truy cập được `http://localhost:8080`

Kiểm tra backend có đang chạy không. Trong starter, root `/` có thể trả 404 vì API thật chưa hoàn thiện.
