package vn.edu.phenikaa.courseregistration.validator;

import java.util.Objects;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.exception.DuplicateRegistrationException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

@Component
@Order(20)
public class DuplicateCourseValidator implements CourseValidator {
    @Override
    public void validate(RegistrationValidationContext context) {
        boolean alreadyRegistered = context.getRegisteredCourses().stream()
            .map(Course::getCourseId)
            .anyMatch(courseId -> Objects.equals(courseId, context.getRequestedCourseId()));

        if (alreadyRegistered) {
            throw new DuplicateRegistrationException(context.getRequestedCourseId());
        }
    }
}
