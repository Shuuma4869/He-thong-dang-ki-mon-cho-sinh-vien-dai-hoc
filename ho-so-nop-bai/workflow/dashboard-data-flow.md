# Dashboard data flow

Dashboard không hard-code số môn hoặc tín chỉ. Dữ liệu hiển thị được tính từ API runtime.

Nguồn dữ liệu:

- Student API: `GET /api/students/23010690`
- Registration API: `GET /api/students/23010690/registrations`
- Course API: `GET /api/courses`
- Notification data: mock/local ở frontend

Baseline demo:

- Sinh viên: `23010690 - Nguyễn Trọng Tuấn`
- Lớp: `CNTT7 - K17`
- Ngành: `Công nghệ thông tin`
- Giới hạn tín chỉ: `18`
- Môn đã đăng ký: `OOP101`, `WEB201`, `DSA102`, `DBS202`, `SE204`
- Tổng tín chỉ: `15`
- Tổng số học phần mở: `40`

Dashboard phải phản ánh thay đổi sau mutation registration. Khi đăng ký thành công `UX205`, tổng tín chỉ tăng từ `15` lên `17`; khi hủy `UX205`, tổng tín chỉ quay về `15`.
