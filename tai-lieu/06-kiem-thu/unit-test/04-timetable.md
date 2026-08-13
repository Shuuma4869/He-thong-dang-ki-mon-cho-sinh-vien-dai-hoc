# Unit test Timetable

Test class:

- `TimetableServiceTest`.
- `TimetableControllerTest`.

Nguồn dữ liệu thời khóa biểu:

```text
Student
-> ACTIVE Registration
-> Course
-> Schedule
-> Lecturer
```

Case chính:

- Sinh viên chưa đăng ký trả danh sách rỗng.
- Một môn có một lịch.
- Nhiều môn và nhiều lịch.
- Registration `CANCELLED` không xuất hiện.
- Lecturer hiển thị đúng.
- Kết quả có thứ tự ổn định.

