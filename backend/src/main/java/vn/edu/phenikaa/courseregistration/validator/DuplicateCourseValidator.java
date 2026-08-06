package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;

/** Validator skeleton kiểm tra đăng ký trùng học phần. */
@Component
public class DuplicateCourseValidator implements CourseValidator {
    @Override
    public void validate(Course course) {
        // TODO: Kiểm tra sinh viên đã đăng ký học phần chưa.
    }
}
