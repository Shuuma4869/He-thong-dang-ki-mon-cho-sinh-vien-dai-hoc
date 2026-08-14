package vn.edu.phenikaa.courseregistration.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import vn.edu.phenikaa.courseregistration.exception.DuplicateRegistrationException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

class DuplicateCourseValidatorTest {
    private final DuplicateCourseValidator validator = new DuplicateCourseValidator();

    @Test
    void passesWhenRequestedCourseHasNotBeenRegistered() {
        Course requestedCourse = course("OOP101");

        assertThatCode(() -> validator.validate(context(requestedCourse, List.of(course("MAT101")))))
            .doesNotThrowAnyException();
    }

    @Test
    void failsWhenRequestedCourseAlreadyRegistered() {
        Course requestedCourse = course("OOP101");

        assertThatThrownBy(() -> validator.validate(context(requestedCourse, List.of(course("OOP101")))))
            .isInstanceOf(DuplicateRegistrationException.class);
    }

    private RegistrationValidationContext context(Course requestedCourse, List<Course> registeredCourses) {
        return new RegistrationValidationContext(
            new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", 20),
            requestedCourse.getCourseId(),
            Optional.of(requestedCourse),
            registeredCourses
        );
    }

    private Course course(String courseId) {
        return new Course(courseId, "Hoc phan " + courseId, 3, "GV001", 60, 20, List.of());
    }
}
