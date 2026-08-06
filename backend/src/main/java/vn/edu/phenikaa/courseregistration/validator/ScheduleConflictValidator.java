package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;

/** Validator skeleton kiểm tra trùng lịch học. */
@Component
public class ScheduleConflictValidator implements CourseValidator {
    @Override
    public void validate(Course course) {
        // TODO: Kiểm tra giao nhau giữa các tiết học.
    }
}
