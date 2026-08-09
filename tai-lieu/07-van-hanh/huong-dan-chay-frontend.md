# Hướng dẫn chạy frontend

## Cập nhật F17

Frontend hiện gọi backend REST API thật qua `http://localhost:8080/api` nếu không override `VITE_API_BASE_URL`.
Cần chạy backend trước khi demo các màn hình đăng nhập, dashboard, danh sách môn, đăng ký/hủy đăng ký và thời khóa biểu.

Tài khoản demo:

- Mã sinh viên: `SV001`
- Mật khẩu: bất kỳ

Yêu cầu:

- Node.js 20 trở lên.
- npm 10 trở lên.

Chạy frontend:

```powershell
cd frontend
npm install
npm run dev
```

Kiểm tra frontend:

```powershell
cd frontend
npm run typecheck
npm run build
```

Notifications vẫn là demo/local state ở frontend. Các màn hình course, registration, timetable và profile cần backend để lấy dữ liệu thật.
