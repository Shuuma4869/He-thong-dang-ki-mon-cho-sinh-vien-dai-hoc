package vn.edu.phenikaa.courseregistration.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import vn.edu.phenikaa.courseregistration.exception.ScheduleConflictException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

class ScheduleConflictValidatorTest {
    private final ScheduleConflictValidator validator = new ScheduleConflictValidator();

    @Test
    void passesWhenSchedulesAreOnDifferentDays() {
        assertThatCode(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 9, 11)),
            course("MAT101", schedule(DayOfWeek.TUESDAY, 9, 11))
        ))).doesNotThrowAnyException();
    }

    @Test
    void passesWhenExistingEndEqualsNewStart() {
        assertThatCode(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 11, 13)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11))
        ))).doesNotThrowAnyException();
    }

    @Test
    void passesWhenNewEndEqualsExistingStart() {
        assertThatCode(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 7, 9)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11))
        ))).doesNotThrowAnyException();
    }

    @Test
    void failsWhenSchedulesOverlapInTheMiddle() {
        assertThatThrownBy(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 10, 12)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11))
        ))).isInstanceOf(ScheduleConflictException.class);
    }

    @Test
    void failsWhenNewScheduleOverlapsLeftSideOfExistingSchedule() {
        assertThatThrownBy(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 8, 10)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11))
        ))).isInstanceOf(ScheduleConflictException.class);
    }

    @Test
    void failsWhenSchedulesHaveSameInterval() {
        assertThatThrownBy(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 9, 11)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11))
        ))).isInstanceOf(ScheduleConflictException.class);
    }

    @Test
    void failsWhenNewScheduleContainsExistingSchedule() {
        assertThatThrownBy(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 8, 12)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11))
        ))).isInstanceOf(ScheduleConflictException.class);
    }

    @Test
    void failsWhenNewScheduleIsInsideExistingSchedule() {
        assertThatThrownBy(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.MONDAY, 10, 11)),
            course("MAT101", schedule(DayOfWeek.MONDAY, 9, 12))
        ))).isInstanceOf(ScheduleConflictException.class);
    }

    @Test
    void failsWhenAnyRegisteredCourseConflicts() {
        assertThatThrownBy(() -> validator.validate(context(
            course("OOP101", schedule(DayOfWeek.WEDNESDAY, 10, 12)),
            List.of(
                course("MAT101", schedule(DayOfWeek.MONDAY, 9, 11)),
                course("PHY101", schedule(DayOfWeek.WEDNESDAY, 11, 13))
            )
        ))).isInstanceOf(ScheduleConflictException.class);
    }

    private RegistrationValidationContext context(Course requestedCourse, Course registeredCourse) {
        return context(requestedCourse, List.of(registeredCourse));
    }

    private RegistrationValidationContext context(Course requestedCourse, List<Course> registeredCourses) {
        return new RegistrationValidationContext(
            new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", 20),
            requestedCourse.getCourseId(),
            Optional.of(requestedCourse),
            registeredCourses
        );
    }

    private Course course(String courseId, Schedule schedule) {
        return new Course(courseId, "Hoc phan " + courseId, 3, "GV001", 60, 20, List.of(schedule));
    }

    private Schedule schedule(DayOfWeek dayOfWeek, int startHour, int endHour) {
        return new Schedule(dayOfWeek, LocalTime.of(startHour, 0), LocalTime.of(endHour, 0), "A101");
    }
}
