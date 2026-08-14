package vn.edu.phenikaa.courseregistration.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import vn.edu.phenikaa.courseregistration.exception.CreditLimitExceededException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

class CreditLimitValidatorTest {
    private final CreditLimitValidator validator = new CreditLimitValidator();

    @Test
    void passesWhenNewCreditsAreLessThanMaxCredits() {
        Course requestedCourse = course("OOP101", 3);
        List<Course> registeredCourses = List.of(course("MAT101", 3), course("PHY101", 3));

        assertThatCode(() -> validator.validate(context(10, requestedCourse, registeredCourses)))
            .doesNotThrowAnyException();
    }

    @Test
    void passesWhenNewCreditsEqualMaxCredits() {
        Course requestedCourse = course("OOP101", 3);
        List<Course> registeredCourses = List.of(course("MAT101", 4), course("PHY101", 3));

        assertThatCode(() -> validator.validate(context(10, requestedCourse, registeredCourses)))
            .doesNotThrowAnyException();
    }

    @Test
    void failsWhenNewCreditsExceedMaxCredits() {
        Course requestedCourse = course("OOP101", 3);
        List<Course> registeredCourses = List.of(course("MAT101", 4), course("PHY101", 4));

        assertThatThrownBy(() -> validator.validate(context(10, requestedCourse, registeredCourses)))
            .isInstanceOf(CreditLimitExceededException.class);
    }

    private RegistrationValidationContext context(int maxCredits, Course requestedCourse, List<Course> registeredCourses) {
        return new RegistrationValidationContext(
            new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", maxCredits),
            requestedCourse.getCourseId(),
            Optional.of(requestedCourse),
            registeredCourses
        );
    }

    private Course course(String courseId, int credits) {
        return new Course(courseId, "Hoc phan " + courseId, credits, "GV001", 60, 20, List.of());
    }
}
