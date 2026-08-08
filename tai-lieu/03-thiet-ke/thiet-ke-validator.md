# Thiết kế validator

Trong bước khóa shared technical foundation, chỉ khóa contract validator. Chưa triển khai validator cụ thể cho Student, Course hoặc Registration.

## Contract dùng chung

`CourseValidator` là interface nền tảng cho các rule kiểm tra học phần.

Contract hiện tại:

```java
void validate(Course course);
```

Ý nghĩa:

- Mỗi validator cụ thể chỉ phụ trách một nhóm rule.
- Validator được gọi từ service khi triển khai nghiệp vụ.
- Validator không tự đọc file.
- Validator không gọi trực tiếp `JsonFileUtils`.
- Validator báo lỗi nghiệp vụ bằng `BusinessException` khi rule không hợp lệ.

## Validator dự kiến ở phase sau

Các validator có thể được tạo sau khi bắt đầu triển khai nghiệp vụ:

- Kiểm tra học phần tồn tại.
- Kiểm tra lớp còn chỗ.
- Kiểm tra sinh viên chưa đăng ký trùng môn.
- Kiểm tra không vượt giới hạn tín chỉ.
- Kiểm tra không trùng lịch học.

Không được tạo class validator cụ thể nếu chưa có service/repository contract tương ứng và test đi kèm.

