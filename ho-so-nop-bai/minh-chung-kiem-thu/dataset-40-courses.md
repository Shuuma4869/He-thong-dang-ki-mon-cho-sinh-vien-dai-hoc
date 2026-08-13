# Minh chứng dataset 40 học phần

Ràng buộc dữ liệu demo hiện tại:

- `data/courses.json` có đúng 40 học phần.
- `data/lecturers.json` có 10 giảng viên.
- `data/students.json` có sinh viên chính `23010690 - Nguyễn Trọng Tuấn`.
- `data/registrations.json` có baseline active cho `23010690` gồm 5 môn, tổng 15 tín chỉ.
- `AI301` đầy sĩ số: `currentCapacity == maxCapacity`.
- `NET203` trùng lịch với `OOP101`.
- `CLOUD301` làm vượt giới hạn tín chỉ: `15 + 5 > 18`.
- `UX205` là case đăng ký thành công: `15 + 2 <= 18` và không trùng lịch.

Test khóa dữ liệu:

```powershell
backend\mvnw.cmd clean test
```

Test liên quan: `DemoDataIntegrityTest`.
