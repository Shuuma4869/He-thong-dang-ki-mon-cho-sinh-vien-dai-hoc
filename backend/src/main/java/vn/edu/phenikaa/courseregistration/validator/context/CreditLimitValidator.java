package vn.edu.phenikaa.courseregistration.validator.context;

public class CreditLimitValidator package vn.edu.phenikaa.courseregistration.validator;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.exception.CreditLimitExceededException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

@Component
@Order(40)
public class CreditLimitValidator implements CourseValidator {
    @Override
    public void validate(RegistrationValidationContext context) {
        Course requestedCourse = context.requireRequestedCourse();
        int currentCredits = context.getRegisteredCourses().stream()
            .mapToInt(Course::getCredits)
            .sum();
        int newCredits = currentCredits + requestedCourse.getCredits();
        int maxCredits = context.getStudent().getMaxCredits();

        if (newCredits > maxCredits) {
            throw new CreditLimitExceededException(newCredits, maxCredits);
        }
    }
}


