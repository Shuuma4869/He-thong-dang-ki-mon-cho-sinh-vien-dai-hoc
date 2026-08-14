# Bảng test case quan trọng

| Test case | Kết quả mong muốn |
|---|---|
| Login `23010690` | Thành công |
| Login `SV999` | `STUDENT_NOT_FOUND` |
| Đăng ký môn hợp lệ | Thêm registration, tăng sĩ số |
| Đăng ký trùng môn | `DUPLICATE_REGISTRATION` |
| Đăng ký môn đầy | `COURSE_FULL` |
| Vượt tín chỉ | `CREDIT_LIMIT_EXCEEDED` |
| Trùng lịch | `SCHEDULE_CONFLICT` |
| Hủy môn đã đăng ký | Xóa detail, giảm sĩ số |
| Timetable SV002 | Danh sách rỗng |

