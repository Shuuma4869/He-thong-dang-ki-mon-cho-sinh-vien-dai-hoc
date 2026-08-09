package vn.edu.phenikaa.courseregistration.model;

/**
 * Composition dùng cho API học phần khi cần trả kèm thông tin giảng viên.
 */
public record CourseWithLecturer(Course course, Lecturer lecturer) {
}
