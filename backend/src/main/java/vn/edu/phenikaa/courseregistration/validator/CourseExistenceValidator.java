package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

@Component
public class CourseExistenceValidator implements CourseValidator {
    @Override
    public void validate(RegistrationValidationContext context) {
        if (context.getRequestedCourse().isEmpty()) {
            throw new CourseNotFoundException(context.getRequestedCourseId());
        }
    }
}
