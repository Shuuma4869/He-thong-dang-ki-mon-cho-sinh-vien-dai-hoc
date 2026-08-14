# Ket qua E2E / runtime smoke

Checklist E2E can xac nhan khi chay demo thu cong:

- Login `23010690`.
- Login loi `SV999`.
- Dashboard 5 mon baseline, 15/18 tin chi.
- Profile hien thi Nguyen Trong Tuan.
- Course list co 40 mon, 10 mon/trang, page 1-4.
- Search `UX205` tren toan bo dataset.
- Register success `UX205`.
- Duplicate/full/credit/schedule conflict error.
- Cancel registration.
- Timetable.
- Notifications.
- Logout.
- Session restore.
- `SV002` empty state.

Ket qua smoke runtime gan nhat:

- Backend chay tam tren `18080` do port `8080` dang bi process khac chiem.
- Frontend dev server chay tren `127.0.0.1:3000`.
- Frontend HTML co root app: PASS.
- `GET /api/courses`: 40 courses.
- `GET /api/students/23010690`: studentId `23010690`, fullName `Nguyen Trong Tuan` theo terminal encoding.
- `GET /api/students/23010690/registrations`: 5 courses, totalCredits `15`.
- `GET /api/students/23010690/timetable`: 6 timetable entries vi `SE204` co 2 schedule.
- `GET /api/courses/search?keyword=UX205`: tra `UX205`.
- Smoke nay khong mutate `data/*.json`.
- Sau smoke, port `18080` va `3000` da duoc dung lai.
