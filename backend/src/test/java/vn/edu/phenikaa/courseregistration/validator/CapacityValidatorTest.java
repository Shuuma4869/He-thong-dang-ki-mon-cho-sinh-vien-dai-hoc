package vn.edu.phenikaa.courseregistration.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import vn.edu.phenikaa.courseregistration.exception.CourseFullException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

class CapacityValidatorTest {
    private final CapacityValidator validator = new CapacityValidator();

    @Test
    void passesWhenCurrentCapacityIsLessThanMaxCapacity() {
        assertThatCode(() -> validator.validate(context(course("OOP101", 10, 9))))
            .doesNotThrowAnyException();
    }

    @Test
    void failsWhenCurrentCapacityEqualsMaxCapacity() {
        assertThatThrownBy(() -> validator.validate(context(course("OOP101", 10, 10))))
            .isInstanceOf(CourseFullException.class);
    }

    @Test
    void failsWhenCurrentCapacityIsGreaterThanMaxCapacity() {
        assertThatThrownBy(() -> validator.validate(context(course("OOP101", 10, 11))))
            .isInstanceOf(CourseFullException.class);
    }

    private RegistrationValidationContext context(Course requestedCourse) {
        return new RegistrationValidationContext(
            new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", 20),
            requestedCourse.getCourseId(),
            Optional.of(requestedCourse),
            List.of()
        );
    }

    private Course course(String courseId, int maxCapacity, int currentCapacity) {
        return new Course(courseId, "Lap trinh huong doi tuong", 3, "GV001", maxCapacity, currentCapacity, List.of());
    }
}
