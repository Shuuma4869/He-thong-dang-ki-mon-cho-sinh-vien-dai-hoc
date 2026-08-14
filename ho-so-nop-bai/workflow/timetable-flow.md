# Timetable flow

```text
Student
-> TimetablePage
-> timetableApi.getTimetable(studentId)
-> GET /api/students/{studentId}/timetable
-> TimetableController
-> TimetableService
-> ACTIVE Registration
-> Course
-> Schedule
-> Lecturer
-> TimetableSlotResponse[]
```

