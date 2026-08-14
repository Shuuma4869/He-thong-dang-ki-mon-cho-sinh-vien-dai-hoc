# Thiết kế lớp

Các lớp domain chính:

- `User`: abstract, chứa `id`, `fullName`.
- `Student`: kế thừa `User`, thêm `className`, `major`, `maxCredits`.
- `Lecturer`: kế thừa `User`, thêm `faculty`.
- `Course`: chứa mã học phần, tên, tín chỉ, giảng viên, sĩ số, danh sách `Schedule`.
- `Schedule`: ngày học, giờ bắt đầu, giờ kết thúc, phòng học.
- `Registration`: phiếu đăng ký của sinh viên.
- `RegistrationDetail`: từng học phần trong phiếu đăng ký.
- `RegistrationStatus`: `ACTIVE`, `CANCELLED`.

Các interface OOP:

- `Registrable`: contract hành vi đăng ký.
- `CourseValidator`: contract kiểm tra một quy tắc đăng ký môn học.

