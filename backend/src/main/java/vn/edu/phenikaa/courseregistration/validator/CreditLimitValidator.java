package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;

/** Validator skeleton kiểm tra giới hạn tín chỉ. */
@Component
public class CreditLimitValidator implements CourseValidator {
    @Override
    public void validate(Course course) {
        // TODO: Kiểm tra tổng tín chỉ trong học kỳ.
    }
}
