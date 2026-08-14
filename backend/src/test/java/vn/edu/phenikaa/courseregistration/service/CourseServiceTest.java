package vn.edu.phenikaa.courseregistration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.LecturerNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {
    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LecturerRepository lecturerRepository;

    @Test
    void findByIdReturnsCourseWithLecturer() {
        Course course = new Course("OOP101", "Lap trinh huong doi tuong", 3, "GV001", 60, 20, List.of());
        Lecturer lecturer = new Lecturer("GV001", "Tran Thi B", "Khoa Cong nghe thong tin");
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(lecturerRepository.findById("GV001")).thenReturn(Optional.of(lecturer));
        CourseService service = new CourseService(courseRepository, lecturerRepository);

        assertThat(service.findById("OOP101"))
            .satisfies(result -> {
                assertThat(result.course()).isSameAs(course);
                assertThat(result.lecturer()).isSameAs(lecturer);
            });
    }

    @Test
    void findByIdThrowsWhenCourseNotFound() {
        when(courseRepository.findById("MISSING")).thenReturn(Optional.empty());
        CourseService service = new CourseService(courseRepository, lecturerRepository);

        assertThatThrownBy(() -> service.findById("MISSING"))
            .isInstanceOf(CourseNotFoundException.class)
            .hasMessageContaining("MISSING");
    }

    @Test
    void searchReturnsCoursesWithLecturers() {
        Course course = new Course("OOP101", "Lap trinh huong doi tuong", 3, "GV001", 60, 20, List.of());
        Lecturer lecturer = new Lecturer("GV001", "Tran Thi B", "Khoa Cong nghe thong tin");
        when(courseRepository.search("oop")).thenReturn(List.of(course));
        when(lecturerRepository.findAll()).thenReturn(List.of(lecturer));
        CourseService service = new CourseService(courseRepository, lecturerRepository);

        assertThat(service.search("oop"))
            .singleElement()
            .satisfies(result -> {
                assertThat(result.course()).isSameAs(course);
                assertThat(result.lecturer()).isSameAs(lecturer);
            });
    }

    @Test
    void findAllLoadsLecturersOnceAndReturnsCoursesWithLecturers() {
        Course oop = new Course("OOP101", "Lap trinh huong doi tuong", 3, "GV001", 60, 20, List.of());
        Course db = new Course("DBI101", "Co so du lieu", 3, "GV002", 50, 10, List.of());
        Lecturer oopLecturer = new Lecturer("GV001", "Tran Thi B", "Khoa Cong nghe thong tin");
        Lecturer dbLecturer = new Lecturer("GV002", "Le Van C", "Khoa Cong nghe thong tin");
        when(courseRepository.findAll()).thenReturn(List.of(oop, db));
        when(lecturerRepository.findAll()).thenReturn(List.of(oopLecturer, dbLecturer));
        CourseService service = new CourseService(courseRepository, lecturerRepository);

        assertThat(service.findAll())
            .extracting(result -> result.lecturer().getFullName())
            .containsExactly("Tran Thi B", "Le Van C");
    }

    @Test
    void findByIdThrowsWhenLecturerNotFound() {
        Course course = new Course("OOP101", "Lap trinh huong doi tuong", 3, "GV404", 60, 20, List.of());
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        when(lecturerRepository.findById("GV404")).thenReturn(Optional.empty());
        CourseService service = new CourseService(courseRepository, lecturerRepository);

        assertThatThrownBy(() -> service.findById("OOP101"))
            .isInstanceOf(LecturerNotFoundException.class)
            .hasMessageContaining("GV404");
    }
}
