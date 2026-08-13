# Checklist trưởng nhóm review

## Moc review du lieu demo

- [ ] `data/courses.json` van dung 40 hoc phan.
- [ ] `data/lecturers.json` van co 10 giang vien va moi `lecturerId` trong course deu hop le.
- [ ] Sinh vien demo `23010690` van co maxCredits = 18.
- [ ] Baseline `23010690` van la 5 mon, tong 15 tin chi, khong trung lich.
- [ ] Course list frontend van phan trang 10 mon/trang va search khong bi gioi han trong trang hien tai.
- [ ] `DemoDataIntegrityTest` pass.

Tài liệu này dành cho trưởng nhóm khi review Pull Request của các thành viên.

## 1. Review chung

- [ ] Base branch là `develop`.
- [ ] Compare branch là `feature/...`.
- [ ] Commit author là thành viên làm phần đó.
- [ ] Đã kiểm tra `git diff --name-status origin/develop...<feature>`.
- [ ] Đã kiểm tra commit author chỉ trong phạm vi branch bằng log so với `origin/develop`.
- [ ] Không có file ngoài scope.
- [ ] Không có build artifacts.
- [ ] Không có secret hoặc `.env.local`.
- [ ] Không hard-code mã sinh viên, path máy cá nhân hoặc URL ngoài shared config.
- [ ] Không có debug code.
- [ ] Không có commented-out code cũ.
- [ ] Không thay shared contract tùy ý.
- [ ] Test/build được ghi rõ trong Pull Request.

## 2. Review Student/Auth/Profile

- [ ] `User` vẫn là lớp cha chung, không chứa logic riêng của Student.
- [ ] `Student` kế thừa `User`.
- [ ] `Student` có `className`, `major`, `maxCredits`.
- [ ] `StudentRepository` đúng contract.
- [ ] `JsonStudentRepository` dùng `JsonFileUtils`.
- [ ] `StudentService` trả `STUDENT_NOT_FOUND` khi thiếu sinh viên.
- [ ] `StudentController` có `GET /api/students/{studentId}`.
- [ ] `AuthController` có `POST /api/auth/login`.
- [ ] Không lưu password.
- [ ] Không dùng JWT hoặc Spring Security.
- [ ] Frontend chỉ lưu mã sinh viên khi remember/session.
- [ ] Profile frontend dùng Student API.
- [ ] Có test service, repository, controller và auth.

## 3. Review Course/Lecturer/Schedule

- [ ] `Course`, `Lecturer`, `Schedule` đúng field.
- [ ] `CourseRepository` và `LecturerRepository` đúng contract.
- [ ] JSON repository dùng `JsonFileUtils`.
- [ ] `CourseService` resolve lecturer đúng.
- [ ] Course API trả lecturer details và schedules.
- [ ] Search hoạt động theo keyword.
- [ ] Không tự thay đổi capacity trong Course API.
- [ ] Frontend Course dùng API thật, không quay lại mock course.
- [ ] Không có file Timetable trong Pull Request Course nếu chưa tới lượt.
- [ ] Có test course và lecturer.

## 4. Review Registration/Validators

- [ ] `Registration`, `RegistrationDetail`, `RegistrationStatus` đúng contract.
- [ ] `RegistrationRepository` đúng contract.
- [ ] `JsonRegistrationRepository` dùng `JsonFileUtils`.
- [ ] Có đủ 5 validator.
- [ ] Validator order là 10, 20, 30, 40, 50.
- [ ] `RegistrationService` dùng `List<CourseValidator>`.
- [ ] Không đổi validator thành if-chain dài.
- [ ] Duplicate được báo trước credit/capacity khi cùng lúc vi phạm nhiều rule.
- [ ] Register success tăng capacity đúng 1.
- [ ] Cancel success giảm capacity đúng 1.
- [ ] Capacity không âm.
- [ ] Validation fail không mutate registration/course.
- [ ] `courseId` blank trả `VALIDATION_ERROR`.
- [ ] Frontend register/cancel hiển thị loading, error, toast.
- [ ] Frontend đồng bộ lại course capacity sau register/cancel.
- [ ] Có test validator, service, controller và regression validator order.

## 5. Review Timetable

- [ ] Pull Request dùng branch riêng `feature/timetable`.
- [ ] Registration/Validators đã được merge vào `develop` trước khi bắt đầu.
- [ ] Timetable được suy ra từ registration active.
- [ ] Không có timetable persistence riêng.
- [ ] Timetable API trả đúng `courseId`, `courseName`, `credits`, `lecturerName`, `dayOfWeek`, `startTime`, `endTime`, `room`.
- [ ] Frontend Timetable dùng API thật.
- [ ] Không đọc trực tiếp `data/*.json` ở frontend.
- [ ] Có test service và controller cho timetable.

## 6. Cách đối chiếu với bản local của trưởng nhóm

Trưởng nhóm có thể đối chiếu Pull Request với bản local đang giữ để kiểm tra:

- architecture;
- API;
- business rules;
- JSON;
- tests.

Không yêu cầu implementation giống từng dòng. Thành viên có thể viết khác nếu behavior đúng, contract đúng, code rõ và test pass.

## 7. Merge policy

Sau review PASS, merge Pull Request vào `develop`.

Ưu tiên giữ lịch sử commit/author của thành viên nếu các commit sạch và có ý nghĩa. Không commit hộ thành viên.

Nếu cần sửa nhỏ, ưu tiên yêu cầu thành viên tự sửa trên feature branch. Trưởng nhóm chỉ tự sửa sau merge khi đó là vấn đề tích hợp thuộc trách nhiệm trưởng nhóm.

## 8. Thứ tự merge

```text
Student/Auth/Profile
-> Course/Lecturer/Schedule
-> Registration/Validators
-> Timetable
```

Sau mỗi lần merge, `develop` phải build/test pass trước khi cho người tiếp theo bắt đầu.
