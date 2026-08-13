# Thiết kế domain

Domain tách rõ dữ liệu sinh viên, giảng viên, môn học và đăng ký.

Áp dụng OOP:

| Khái niệm | Áp dụng |
|---|---|
| Encapsulation | Field trong model là private, truy cập qua getter/setter |
| Inheritance | `Student` và `Lecturer` kế thừa `User` |
| Abstraction | `User` là abstract class |
| Interface | `Registrable`, `CourseValidator` |
| Polymorphism | `RegistrationService` chạy `List<CourseValidator>` |
| Collections | `List`, `Map`, `Optional` trong service/repository |
| Exception handling | `BusinessException` và các exception nghiệp vụ |
| File IO | `JsonFileUtils` và JSON repository |

