# Kết quả E2E

Checklist E2E cần xác nhận khi chạy demo:

- Login `SV001`.
- Login lỗi `SV999`.
- Dashboard.
- Profile.
- Course list/search/detail.
- Register success.
- Duplicate/full/credit/schedule conflict error.
- Cancel registration.
- Timetable.
- Notifications.
- Logout.
- Session restore.
- `SV002` empty state.

Kết quả smoke runtime gần nhất:

- Backend chạy tạm trên `18080` do port `8080` đang bị process khác chiếm.
- `GET /api/students/SV001`: `200`.
- `POST /api/auth/login` với `SV001`: success.
- `POST /api/auth/login` với `SV999`: `STUDENT_NOT_FOUND`.
- `GET /api/courses/search?keyword=OOP`: success.
- `GET /api/students/SV001/timetable`: success.
- Đăng ký `DBS202` cho `SV002`: success, sĩ số tăng.
- Restart backend: registration của `SV002` vẫn còn.
- Đăng ký trùng `DBS202`: `DUPLICATE_REGISTRATION`.
- Hủy `DBS202`: success, sau đó restore `data/` về baseline.
