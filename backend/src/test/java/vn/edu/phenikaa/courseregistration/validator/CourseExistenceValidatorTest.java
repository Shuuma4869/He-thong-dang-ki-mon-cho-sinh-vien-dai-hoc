package vn.edu.phenikaa.courseregistration.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

class CourseExistenceValidatorTest {
    private final CourseExistenceValidator validator = new CourseExistenceValidator();

    @Test
    void passesWhenRequestedCourseExists() {
        Course course = course("OOP101");

        assertThatCode(() -> validator.validate(context("OOP101", Optional.of(course))))
            .doesNotThrowAnyException();
    }

    @Test
    void failsWhenRequestedCourseDoesNotExist() {
        assertThatThrownBy(() -> validator.validate(context("MISSING", Optional.empty())))
            .isInstanceOf(CourseNotFoundException.class)
            .hasMessageContaining("MISSING");
    }

    private RegistrationValidationContext context(String requestedCourseId, Optional<Course> requestedCourse) {
        return new RegistrationValidationContext(
            new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", 20),
            requestedCourseId,
            requestedCourse,
            List.of()
        );
    }

    private Course course(String courseId) {
        return new Course(courseId, "Lap trinh huong doi tuong", 3, "GV001", 60, 20, List.of());
    }
}
