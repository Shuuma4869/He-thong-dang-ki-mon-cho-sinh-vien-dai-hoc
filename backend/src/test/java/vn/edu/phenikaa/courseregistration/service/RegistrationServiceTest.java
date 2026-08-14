package vn.edu.phenikaa.courseregistration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.phenikaa.courseregistration.exception.CourseFullException;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.CreditLimitExceededException;
import vn.edu.phenikaa.courseregistration.exception.DuplicateRegistrationException;
import vn.edu.phenikaa.courseregistration.exception.RegistrationNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.ScheduleConflictException;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.RegistrationSummary;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;
import vn.edu.phenikaa.courseregistration.validator.CapacityValidator;
import vn.edu.phenikaa.courseregistration.validator.CourseExistenceValidator;
import vn.edu.phenikaa.courseregistration.validator.CreditLimitValidator;
import vn.edu.phenikaa.courseregistration.validator.DuplicateCourseValidator;
import vn.edu.phenikaa.courseregistration.validator.ScheduleConflictValidator;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {
    private static final Clock CLOCK = Clock.fixed(
        Instant.parse("2026-08-08T00:00:00Z"),
        ZoneId.of("UTC")
    );

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LecturerRepository lecturerRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @Test
    void registerSuccessCreatesRegistrationAndIncrementsCapacity() {
        Course course = course("OOP101", 3, 60, 20);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of());

        Registration saved = service().registerCourse("SV001", "OOP101");

        assertThat(saved.getRegistrationId()).isEqualTo("REG-SV001-" + CLOCK.millis());
        assertThat(saved.getRegisteredAt()).isEqualTo(LocalDateTime.now(CLOCK));
        assertThat(saved.getDetails()).extracting(RegistrationDetail::getCourseId).containsExactly("OOP101");
        assertThat(course.getCurrentCapacity()).isEqualTo(21);
        verify(registrationRepository).save(saved);
        verify(courseRepository).save(course);
    }

    @Test
    void registerFailsWhenStudentNotFound() {
        when(studentRepository.findById("SV404")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().registerCourse("SV404", "OOP101"))
            .isInstanceOf(StudentNotFoundException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWhenCourseNotFound() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("MISSING")).thenReturn(Optional.empty());
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of());

        assertThatThrownBy(() -> service().registerCourse("SV001", "MISSING"))
            .isInstanceOf(CourseNotFoundException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWhenCourseIsFull() {
        Course course = course("OOP101", 3, 60, 60);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of());

        assertThatThrownBy(() -> service().registerCourse("SV001", "OOP101"))
            .isInstanceOf(CourseFullException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWhenCourseAlreadyRegistered() {
        Course course = course("OOP101", 3, 60, 20);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "OOP101")));
        assertThatThrownBy(() -> service().registerCourse("SV001", "OOP101"))
            .isInstanceOf(DuplicateRegistrationException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWithDuplicateWhenDuplicateAlsoExceedsCreditLimit() {
        Course oop = course("OOP101", 3, 60, 20);
        Course web = course("WEB201", 3, 60, 20);
        Course dbs = course("DBS202", 3, 60, 20);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(10)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(oop));
        when(courseRepository.findById("WEB201")).thenReturn(Optional.of(web));
        when(courseRepository.findById("DBS202")).thenReturn(Optional.of(dbs));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "OOP101", "WEB201", "DBS202")));

        assertThatThrownBy(() -> service().registerCourse("SV001", "DBS202"))
            .isInstanceOf(DuplicateRegistrationException.class)
            .isNotInstanceOf(CreditLimitExceededException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWithDuplicateWhenDuplicateCourseIsFull() {
        Course course = course("OOP101", 3, 60, 60);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "OOP101")));

        assertThatThrownBy(() -> service().registerCourse("SV001", "OOP101"))
            .isInstanceOf(DuplicateRegistrationException.class)
            .isNotInstanceOf(CourseFullException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWhenCreditLimitExceeded() {
        Course requestedCourse = course("OOP101", 3, 60, 20);
        Course registeredCourse = course("MAT101", 8, 60, 20);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(10)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(requestedCourse));
        when(courseRepository.findById("MAT101")).thenReturn(Optional.of(registeredCourse));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "MAT101")));

        assertThatThrownBy(() -> service().registerCourse("SV001", "OOP101"))
            .isInstanceOf(CreditLimitExceededException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void registerFailsWhenScheduleConflict() {
        Course requestedCourse = course(
            "OOP101",
            3,
            60,
            20,
            schedule(DayOfWeek.MONDAY, 10, 12)
        );
        Course registeredCourse = course(
            "MAT101",
            3,
            60,
            20,
            schedule(DayOfWeek.MONDAY, 9, 11)
        );
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(requestedCourse));
        when(courseRepository.findById("MAT101")).thenReturn(Optional.of(registeredCourse));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "MAT101")));

        assertThatThrownBy(() -> service().registerCourse("SV001", "OOP101"))
            .isInstanceOf(ScheduleConflictException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void cancelSuccessRemovesCourseAndDecrementsCapacity() {
        Course course = course("OOP101", 3, 60, 2);
        Registration registration = registration("REG001", "SV001", "OOP101", "MAT101");
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of(registration));

        Registration saved = service().cancelCourse("SV001", "OOP101");

        assertThat(saved.getStatus()).isEqualTo(RegistrationStatus.ACTIVE);
        assertThat(saved.getDetails()).extracting(RegistrationDetail::getCourseId).containsExactly("MAT101");
        assertThat(course.getCurrentCapacity()).isEqualTo(1);
        verify(registrationRepository).save(saved);
        verify(courseRepository).save(course);
    }

    @Test
    void cancelFailsWhenCourseIsNotRegistered() {
        Course course = course("OOP101", 3, 60, 2);
        Registration registration = registration("REG001", "SV001", "MAT101");
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of(registration));

        assertThatThrownBy(() -> service().cancelCourse("SV001", "OOP101"))
            .isInstanceOf(RegistrationNotFoundException.class);
        verify(registrationRepository, never()).save(any());
        verify(courseRepository, never()).save(any());
    }

    @Test
    void cancelDoesNotMakeCapacityNegative() {
        Course course = course("OOP101", 3, 60, 0);
        Registration registration = registration("REG001", "SV001", "OOP101");
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of(registration));

        service().cancelCourse("SV001", "OOP101");

        ArgumentCaptor<Course> courseCaptor = ArgumentCaptor.forClass(Course.class);
        verify(courseRepository).save(courseCaptor.capture());
        assertThat(courseCaptor.getValue().getCurrentCapacity()).isZero();
    }

    @Test
    void calculateTotalCreditsFromActiveRegistration() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "OOP101", "MAT101")));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course("OOP101", 3, 60, 20)));
        when(courseRepository.findById("MAT101")).thenReturn(Optional.of(course("MAT101", 4, 60, 20)));

        assertThat(service().calculateTotalCredits("SV001")).isEqualTo(7);
    }

    @Test
    void findActiveRegistrationSummaryReturnsEmptyCoursesWhenStudentHasNoActiveRegistration() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of());

        RegistrationSummary summary = service().findActiveRegistrationSummary("SV001");

        assertThat(summary.registration().getStudentId()).isEqualTo("SV001");
        assertThat(summary.registration().getRegistrationId()).isNull();
        assertThat(summary.courses()).isEmpty();
    }

    @Test
    void findActiveRegistrationSummaryResolvesCoursesLecturersSchedulesAndCredits() {
        Course oop = course("OOP101", 3, 60, 20, schedule(DayOfWeek.MONDAY, 7, 9));
        Course math = course("MAT101", 4, 60, 20, schedule(DayOfWeek.TUESDAY, 9, 11));
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration("REG001", "SV001", "OOP101", "MAT101")));
        when(courseRepository.findAll()).thenReturn(List.of(oop, math));
        when(lecturerRepository.findAll()).thenReturn(List.of(lecturer("GV001")));

        RegistrationSummary summary = service().findActiveRegistrationSummary("SV001");

        assertThat(summary.courses()).hasSize(2);
        assertThat(summary.courses()).extracting(item -> item.course().getCourseId())
            .containsExactly("OOP101", "MAT101");
        assertThat(summary.courses()).extracting(item -> item.lecturer().getFullName())
            .containsExactly("Giang vien GV001", "Giang vien GV001");
        assertThat(summary.courses().stream().mapToInt(item -> item.course().getCredits()).sum()).isEqualTo(7);
        assertThat(summary.courses().getFirst().course().getSchedules()).hasSize(1);
    }

    @Test
    void registerCourseSummaryReturnsUpdatedRegistrationSummary() {
        Course course = course("OOP101", 3, 60, 20, schedule(DayOfWeek.MONDAY, 7, 9));
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of());
        when(courseRepository.findAll()).thenReturn(List.of(course));
        when(lecturerRepository.findAll()).thenReturn(List.of(lecturer("GV001")));

        RegistrationSummary summary = service().registerCourseSummary("SV001", "OOP101");

        assertThat(summary.registration().getDetails()).extracting(RegistrationDetail::getCourseId)
            .containsExactly("OOP101");
        assertThat(summary.courses()).hasSize(1);
        assertThat(summary.courses().getFirst().course().getCurrentCapacity()).isEqualTo(21);
    }

    @Test
    void cancelCourseSummaryReturnsRemainingCourses() {
        Course oop = course("OOP101", 3, 60, 2);
        Course math = course("MAT101", 4, 60, 20);
        Registration registration = registration("REG001", "SV001", "OOP101", "MAT101");
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student(20)));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(oop));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of(registration));
        when(courseRepository.findAll()).thenReturn(List.of(math));
        when(lecturerRepository.findAll()).thenReturn(List.of(lecturer("GV001")));

        RegistrationSummary summary = service().cancelCourseSummary("SV001", "OOP101");

        assertThat(summary.registration().getDetails()).extracting(RegistrationDetail::getCourseId)
            .containsExactly("MAT101");
        assertThat(summary.courses()).extracting(item -> item.course().getCourseId())
            .containsExactly("MAT101");
    }

    private RegistrationService service() {
        return new RegistrationService(
            studentRepository,
            courseRepository,
            lecturerRepository,
            registrationRepository,
            validators(),
            CLOCK
        );
    }

    private List<CourseValidator> validators() {
        return List.of(
            new CourseExistenceValidator(),
            new DuplicateCourseValidator(),
            new CapacityValidator(),
            new CreditLimitValidator(),
            new ScheduleConflictValidator()
        );
    }

    private Student student(int maxCredits) {
        return new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", maxCredits);
    }

    private Lecturer lecturer(String lecturerId) {
        return new Lecturer(lecturerId, "Giang vien " + lecturerId, "CNTT");
    }
    private Registration registration(String registrationId, String studentId, String... courseIds) {
        List<RegistrationDetail> details = new ArrayList<>();
        for (String courseId : courseIds) {
            details.add(new RegistrationDetail(courseId));
        }
        return new Registration(
            registrationId,
            studentId,
            RegistrationStatus.ACTIVE,
            LocalDateTime.now(CLOCK),
            details
        );
    }

    private Course course(String courseId, int credits, int maxCapacity, int currentCapacity) {
        return course(courseId, credits, maxCapacity, currentCapacity, List.of());
    }

    private Course course(
        String courseId,
        int credits,
        int maxCapacity,
        int currentCapacity,
        Schedule schedule
    ) {
        return course(courseId, credits, maxCapacity, currentCapacity, List.of(schedule));
    }

    private Course course(
        String courseId,
        int credits,
        int maxCapacity,
        int currentCapacity,
        List<Schedule> schedules
    ) {
        return new Course(courseId, "Hoc phan " + courseId, credits, "GV001", maxCapacity, currentCapacity, schedules);
    }

    private Schedule schedule(DayOfWeek dayOfWeek, int startHour, int endHour) {
        return new Schedule(dayOfWeek, LocalTime.of(startHour, 0), LocalTime.of(endHour, 0), "A101");
    }
}
