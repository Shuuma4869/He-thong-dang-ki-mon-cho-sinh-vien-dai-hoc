package vn.edu.phenikaa.courseregistration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.model.TimetableEntry;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;
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

    @Mock
    private LecturerRepository lecturerRepository;

    @Test
    void findTimetableEntriesReturnsEmptyWhenStudentHasNoActiveRegistration() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001")).thenReturn(List.of());

        assertThat(service().findTimetableEntries("SV001")).isEmpty();
    }

    @Test
    void findTimetableEntriesReturnsSingleCourseSingleSchedule() {
        Course oop = course("OOP101", "Lap trinh huong doi tuong", "GV001",
            schedule(DayOfWeek.MONDAY, 7, 30, 9, 30, "A101"));
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration(RegistrationStatus.ACTIVE, "OOP101")));
        when(courseRepository.findAll()).thenReturn(List.of(oop));
        when(lecturerRepository.findAll()).thenReturn(List.of(lecturer("GV001", "Tran Thi B")));

        assertThat(service().findTimetableEntries("SV001"))
            .singleElement()
            .satisfies(entry -> {
                assertThat(entry.course().getCourseId()).isEqualTo("OOP101");
                assertThat(entry.course().getCourseName()).isEqualTo("Lap trinh huong doi tuong");
                assertThat(entry.lecturer().getFullName()).isEqualTo("Tran Thi B");
                assertThat(entry.schedule().getRoom()).isEqualTo("A101");
                assertThat(entry.schedule().getStartTime()).isEqualTo(LocalTime.of(7, 30));
                assertThat(entry.schedule().getEndTime()).isEqualTo(LocalTime.of(9, 30));
            });
    }

    @Test
    void findTimetableEntriesCreatesEntryForEachSchedule() {
        Course oop = course(
            "OOP101",
            "Lap trinh huong doi tuong",
            "GV001",
            schedule(DayOfWeek.MONDAY, 7, 30, 9, 30, "A101"),
            schedule(DayOfWeek.WEDNESDAY, 7, 30, 9, 30, "A102")
        );
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration(RegistrationStatus.ACTIVE, "OOP101")));
        when(courseRepository.findAll()).thenReturn(List.of(oop));
        when(lecturerRepository.findAll()).thenReturn(List.of(lecturer("GV001", "Tran Thi B")));

        assertThat(service().findTimetableEntries("SV001"))
            .extracting(entry -> entry.schedule().getRoom())
            .containsExactly("A101", "A102");
    }

    @Test
    void findTimetableEntriesReturnsMultipleCoursesWithDeterministicOrdering() {
        Course math = course("MAT101", "Giai tich", "GV002",
            schedule(DayOfWeek.MONDAY, 9, 35, 11, 10, "A201"));
        Course oop = course("OOP101", "Lap trinh huong doi tuong", "GV001",
            schedule(DayOfWeek.MONDAY, 7, 30, 9, 30, "A101"));
        Course db = course("DBI101", "Co so du lieu", "GV003",
            schedule(DayOfWeek.TUESDAY, 7, 30, 9, 30, "A301"));
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration(RegistrationStatus.ACTIVE, "MAT101", "DBI101", "OOP101")));
        when(courseRepository.findAll()).thenReturn(List.of(math, db, oop));
        when(lecturerRepository.findAll()).thenReturn(List.of(
            lecturer("GV001", "Tran Thi B"),
            lecturer("GV002", "Le Van C"),
            lecturer("GV003", "Pham Van D")
        ));

        assertThat(service().findTimetableEntries("SV001"))
            .extracting(entry -> entry.course().getCourseId())
            .containsExactly("OOP101", "MAT101", "DBI101");
    }

    @Test
    void findTimetableEntriesIgnoresCancelledRegistration() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration(RegistrationStatus.CANCELLED, "OOP101")));

        assertThat(service().findTimetableEntries("SV001")).isEmpty();
    }

    @Test
    void findRegisteredCoursesKeepsLegacyCourseListBehavior() {
        Course oop = course("OOP101", "Lap trinh huong doi tuong", "GV001");
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student()));
        when(registrationRepository.findByStudentId("SV001"))
            .thenReturn(List.of(registration(RegistrationStatus.ACTIVE, "OOP101")));
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(oop));

        assertThat(service().findRegisteredCourses("SV001")).containsExactly(oop);
    }

    @Test
    void findTimetableEntriesThrowsWhenStudentNotFound() {
        when(studentRepository.findById("SV404")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().findTimetableEntries("SV404"))
            .isInstanceOf(StudentNotFoundException.class);
    }

    private TimetableService service() {
        return new TimetableService(studentRepository, registrationRepository, courseRepository, lecturerRepository);
    }

    private Student student() {
        return new Student("SV001", "Nguyen Van A", "K16-CNTT", "CNTT", 20);
    }

    private Registration registration(RegistrationStatus status, String... courseIds) {
        return new Registration(
            "REG001",
            "SV001",
            status,
            LocalDateTime.of(2026, 8, 8, 20, 50),
            List.of(courseIds).stream()
                .map(RegistrationDetail::new)
                .toList()
        );
    }

    private Course course(String courseId, String courseName, String lecturerId, Schedule... schedules) {
        return new Course(courseId, courseName, 3, lecturerId, 60, 20, List.of(schedules));
    }

    private Lecturer lecturer(String lecturerId, String fullName) {
        return new Lecturer(lecturerId, fullName, "Khoa Cong nghe thong tin");
    }

    private Schedule schedule(
        DayOfWeek dayOfWeek,
        int startHour,
        int startMinute,
        int endHour,
        int endMinute,
        String room
    ) {
        return new Schedule(dayOfWeek, LocalTime.of(startHour, startMinute), LocalTime.of(endHour, endMinute), room);
    }
}
