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
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {
    @Mock
    private CourseRepository courseRepository;

    @Test
    void findByIdReturnsCourse() {
        Course course = new Course("OOP101", "Lap trinh huong doi tuong", 3, "GV001", 60, 20, List.of());
        when(courseRepository.findById("OOP101")).thenReturn(Optional.of(course));
        CourseService service = new CourseService(courseRepository);

        assertThat(service.findById("OOP101")).isSameAs(course);
    }

    @Test
    void findByIdThrowsWhenCourseNotFound() {
        when(courseRepository.findById("MISSING")).thenReturn(Optional.empty());
        CourseService service = new CourseService(courseRepository);

        assertThatThrownBy(() -> service.findById("MISSING"))
                .isInstanceOf(CourseNotFoundException.class)
                .hasMessageContaining("MISSING");
    }

    @Test
    void searchDelegatesToRepository() {
        Course course = new Course("OOP101", "Lap trinh huong doi tuong", 3, "GV001", 60, 20, List.of());
        when(courseRepository.search("oop")).thenReturn(List.of(course));
        CourseService service = new CourseService(courseRepository);

        assertThat(service.search("oop")).containsExactly(course);
    }
}
