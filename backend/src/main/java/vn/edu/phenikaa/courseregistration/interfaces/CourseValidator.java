package vn.edu.phenikaa.courseregistration.interfaces;

import vn.edu.phenikaa.courseregistration.model.Course;

/** Interface cho các validator kiểm tra điều kiện đăng ký học phần. */
public interface CourseValidator {
    void validate(Course course);
}
