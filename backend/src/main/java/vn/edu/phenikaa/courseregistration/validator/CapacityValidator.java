package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.exception.CourseFullException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

@Component
@Order(30)
public class CapacityValidator implements CourseValidator {
    @Override
    public void validate(RegistrationValidationContext context) {
        Course course = context.requireRequestedCourse();
        if (course.getCurrentCapacity() >= course.getMaxCapacity()) {
            throw new CourseFullException(course.getCourseId());
        }
    }
}
