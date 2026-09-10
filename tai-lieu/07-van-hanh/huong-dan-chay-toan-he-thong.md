# Hướng dẫn chạy toàn hệ thống

Quy trình chính được chạy bằng Git Bash để từng bước có kết quả rõ ràng. Người dùng PowerShell có thể dùng cú pháp Maven Wrapper tương đương được ghi chú bên dưới.

## Chuẩn bị và kiểm tra

Khối lệnh này dùng Git Bash. Trong PowerShell, dùng `.\mvnw.cmd` thay cho `./mvnw.cmd`.

```bash
git --version
java -version
node -v
npm -v

cd frontend
npm ci
npm run typecheck
npm run build
cd ../backend
./mvnw.cmd test
./mvnw.cmd verify
```

`test` chạy nhóm test Surefire (unit, controller slice và regression). `verify` chạy lại nhóm này, build backend và chạy integration test `*IT.java` bằng Maven Failsafe.

Trên Windows có thể dùng wrapper tương đương trong `scripts/`:

```powershell
.\scripts\kiem-tra-du-an.bat
.\scripts\chay-du-an.bat
```

Hai script này dùng `backend\mvnw.cmd clean verify`, vì vậy không bỏ qua integration test.

## Chạy ứng dụng

Terminal backend:

```bash
cd backend
./mvnw.cmd spring-boot:run
```

Terminal frontend:

```bash
cd frontend
npm run dev
```

- Backend: `http://localhost:8080`
- API: `http://localhost:8080/api`
- Frontend: `http://localhost:3000`

## Smoke test

```bash
curl -i http://localhost:8080/api/courses
curl -i http://localhost:8080/api/courses/OOP101
curl -i "http://localhost:8080/api/courses/search?keyword=OOP"
```

Ba request phải trả HTTP `200` và JSON dữ liệu hợp lệ. Sau đó thực hiện checklist trong `kiem-thu/kiem-thu-e2e.md`.
