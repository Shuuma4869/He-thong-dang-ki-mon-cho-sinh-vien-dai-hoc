package vn.edu.phenikaa.courseregistration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

@ExtendWith(MockitoExtension.class)
class TimetableServiceTest {
    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private CourseRepository courseRepository;

    @Test
    void findRegisteredCoursesReturnsCoursesFromActiveRegistration() {
        Course oop = course("OOP101");
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
                .thenReturn(List.of(registration(RegistrationStatus.ACTIVE, "OOP101")));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(oop));

        assertThat(service().findRegisteredCourses("SV001")).containsExactly(oop);
    }

    @Test
    void findRegisteredCoursesIgnoresCancelledRegistration() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
                .thenReturn(List.of(registration(RegistrationStatus.CANCELLED, "OOP101")));

        assertThat(service().findRegisteredCourses("SV001")).isEmpty();
    }

    @Test
    void findRegisteredCoursesThrowsWhenStudentNotFound() {
        when(studentRepository.findById("SV404")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().findRegisteredCourses("SV404"))
                .isInstanceOf(StudentNotFoundException.class);
    }

    private TimetableService service() {
        return new TimetableService(studentRepository, registrationRepository, courseRepository);
    }

    private Student student() {
        return new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", 20);
    }

    private Registration registration(RegistrationStatus status, String courseId) {
        return new Registration(
                "REG001",
                "SV001",
                status,
                LocalDateTime.of(2026, 8, 8, 20, 50),
                List.of(new RegistrationDetail(courseId))
        );
    }

    private Course course(String courseId) {
        return new Course(courseId, "Hoc phan " + courseId, 3, "GV001", 60, 20, List.of());
    }
}
