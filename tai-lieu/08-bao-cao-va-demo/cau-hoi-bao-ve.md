# Câu hỏi bảo vệ

## Vì sao dùng JSON thay database?

Vì đồ án tập trung OOP và demo local. JSON giúp minh họa File IO, repository pattern và persistence đơn giản mà không cần cài database.

## Encapsulation ở đâu?

Các model như `User`, `Student`, `Course`, `Registration` dùng field `private` và truy cập qua getter/setter.

## Inheritance ở đâu?

`Student extends User` và `Lecturer extends User`. `User` giữ `id`, `fullName`; lớp con giữ dữ liệu riêng.

## Polymorphism ở đâu?

`RegistrationService` nhận `List<CourseValidator>` và gọi cùng method `validate`. Mỗi validator có implementation khác nhau.

## Abstract class ở đâu?

`User` là abstract class cho các loại người dùng chung.

## Interface ở đâu?

`Registrable`, `CourseValidator` và các repository như `StudentRepository`, `CourseRepository`, `RegistrationRepository`, `LecturerRepository`.

## Collections ở đâu?

`List` dùng cho danh sách course, schedule, registration detail. `Map` dùng trong `CourseService`, `RegistrationService`, `TimetableService` để lookup course/lecturer nhanh khi compose response.

## Exception Handling ở đâu?

`BusinessException` chứa `errorCode`; các subclass như `CourseFullException`, `ScheduleConflictException`; `GlobalExceptionHandler` đổi exception thành `ApiErrorResponse`.

## File IO ở đâu?

`JsonFileUtils` đọc/ghi JSON UTF-8; `JsonStudentRepository`, `JsonCourseRepository`, `JsonRegistrationRepository`, `JsonLecturerRepository` dùng utility này.

## Vì sao validator order quan trọng?

Một request có thể vi phạm nhiều rule. Thứ tự `@Order(10/20/30/40/50)` giúp error trả về nhất quán, ví dụ duplicate phải ưu tiên hơn credit limit.

## Trùng lịch kiểm tra thế nào?

Conflict khi cùng ngày và:

```text
newStart < existingEnd
AND newEnd > existingStart
```

Nếu hai lịch chỉ chạm biên giờ kết thúc/bắt đầu thì không conflict.

## Vì sao frontend không tự kiểm tra credit?

Frontend có thể hiển thị cảnh báo, nhưng quyết định nghiệp vụ phải ở backend để tránh bypass và giữ dữ liệu JSON nhất quán.

## Vì sao timetable không có JSON riêng?

Timetable được suy ra từ registration active, course schedule và lecturer. Lưu riêng sẽ dễ trùng lặp và lệch dữ liệu.

## Vì sao không dùng JWT?

Phạm vi đồ án dùng auth demo bằng `studentId`. Chưa triển khai xác thực bảo mật hoặc phân quyền production.

## Nếu nhiều người ghi file JSON cùng lúc thì sao?

Đây là giới hạn của JSON File IO demo. Hệ thống chưa có transaction/concurrency control như database. Nếu nâng cấp, nên chuyển sang database và transaction.

## Hạn chế của project?

JSON File IO chỉ phù hợp demo, auth chưa bảo mật, notifications local, chưa có role/admin/lecturer portal và chưa có xử lý concurrency production.

## Nếu nâng cấp production sẽ thay đổi gì?

Thêm database, transaction, Spring Security, JWT/session thật, role, admin/lecturer portal, notification backend, audit log và test mở rộng.
