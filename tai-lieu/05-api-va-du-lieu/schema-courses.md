# Schema courses.json

File: `data/courses.json`

```json
{
  "courseId": "OOP101",
  "courseName": "Lap trinh huong doi tuong",
  "credits": 3,
  "lecturerId": "GV001",
  "maxCapacity": 60,
  "currentCapacity": 42,
  "schedules": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "07:30:00",
      "endTime": "09:30:00",
      "room": "A2-301"
    }
  ]
}
```

Baseline hien co dung 40 mon hoc. Frontend hien thi toi da 10 mon/trang, nen dataset nay tao 4 trang.

Cac case khoa:

- `AI301.currentCapacity == AI301.maxCapacity`, dung cho `COURSE_FULL`.
- `NET203` trung lich voi `OOP101`, dung cho `SCHEDULE_CONFLICT`.
- `CLOUD301` co 5 tin chi, dung cho `CREDIT_LIMIT_EXCEEDED` voi baseline 15/18.
- `UX205` dung cho dang ky thanh cong.
- `DBS202.currentCapacity` o baseline la `28`.

