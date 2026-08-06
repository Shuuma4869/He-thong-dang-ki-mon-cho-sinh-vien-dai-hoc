package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;

/** Validator skeleton kiểm tra sức chứa lớp học phần. */
@Component
public class CapacityValidator implements CourseValidator {
    @Override
    public void validate(Course course) {
        // TODO: Kiểm tra sĩ số tối đa.
    }
}
