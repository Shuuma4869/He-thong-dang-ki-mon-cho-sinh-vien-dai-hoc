# Hướng dẫn chạy frontend

Frontend là React + TypeScript + Vite, chạy mặc định tại port `3000`.

## Yêu cầu

- Node.js 20 trở lên.
- npm 10 trở lên.

Kiểm tra:

```powershell
node -v
npm -v
```

## Chạy frontend

Nên chạy backend trước để các flow core hoạt động đầy đủ.

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

API runtime mặc định:

```text
http://localhost:8080/api
```

Khi chạy bằng script tổng `scripts\chay-du-an.bat`, frontend sẽ tự nhận `VITE_API_BASE_URL` theo port backend thực tế. Nếu `8080` bị chiếm và backend phải chạy ở `18080`, script tổng sẽ truyền:

```text
VITE_API_BASE_URL=http://localhost:18080/api
```

Nếu cần override:

```powershell
copy .env.example .env.local
```

Sau đó sửa:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Không commit `.env.local`.

## Demo account

- Mã sinh viên: `23010690`
- Mật khẩu: bất kỳ chuỗi không rỗng

Backend chỉ định danh sinh viên bằng `studentId`, không xác thực mật khẩu thật.

## Kiểm tra frontend

```powershell
cd frontend
npm run typecheck
npm run build
```

Nếu `npm run build` gặp `spawn EPERM` trong sandbox, chạy lại ngoài sandbox. Đây là lỗi môi trường chặn Vite/esbuild, không phải lỗi source code nếu build ngoài sandbox pass.

## Phạm vi dữ liệu

- Auth, profile, courses, registration và timetable cần backend.
- Dashboard tổng hợp dữ liệu từ API/state frontend.
- Notifications là demo/local state ở frontend.
