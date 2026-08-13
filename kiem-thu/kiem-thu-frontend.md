# Kiểm thử frontend

Frontend hiện kiểm tra bằng:

```powershell
cd frontend
npm run typecheck
npm run build
npm run dev
```

Checklist manual:

- Login `23010690` thành công.
- Login `SV999` hiển thị lỗi và dừng loading.
- Khi backend không chạy, nút login không treo vô hạn.
- Dashboard hiển thị số liệu từ API.
- Course list/search/detail hoạt động.
- Register/cancel gọi backend và refresh dữ liệu.
- Timetable hiển thị lịch từ registration đang hoạt động.
- Profile hiển thị dữ liệu sinh viên thật.

